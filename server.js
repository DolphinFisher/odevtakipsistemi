import express from 'express';
import axios from 'axios';
import * as cheerio from 'cheerio';
import cors from 'cors';
import pg from 'pg';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Database setup - PostgreSQL
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: false, // Force disable SSL for internal connection
});

pool.on('error', (err) => {
  console.error('Unexpected PostgreSQL error on idle client:', err);
});

async function initDB() {
  try {
    const client = await pool.connect();
    console.log('Successfully connected to PostgreSQL database');
    await client.query(`CREATE TABLE IF NOT EXISTS homeworks (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      course TEXT,
      duedate TEXT,
      createdat TEXT,
      status TEXT,
      attachmentname TEXT,
      author TEXT
    )`);
    client.release();
  } catch (err) {
    console.error('Error initializing database:', err);
  }
}
initDB();

app.use(cors());
app.use(express.json());

// Health Check Endpoint
app.get('/api/health', async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    client.release();
    res.json({ status: 'ok', time: result.rows[0].now, db: 'connected' });
  } catch (err) {
    console.error('Health check failed:', err);
    res.status(500).json({ status: 'error', message: err.message, stack: err.stack });
  }
});


// Homework Endpoints

// GET /api/homeworks
app.get('/api/homeworks', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM homeworks ORDER BY id DESC');
    // Map snake_case columns back to camelCase for frontend
    const rows = result.rows.map(row => ({
      id: row.id,
      title: row.title,
      description: row.description,
      course: row.course,
      dueDate: row.duedate,
      createdAt: row.createdat,
      status: row.status,
      attachmentName: row.attachmentname,
      author: row.author,
    }));
    res.json(rows);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// POST /api/homeworks
app.post('/api/homeworks', async (req, res) => {
  const { title, description, course, dueDate, createdAt, status, attachmentName, author } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO homeworks (title, description, course, duedate, createdat, status, attachmentname, author) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [title, description, course, dueDate, createdAt, status, attachmentName, author]
    );
    const row = result.rows[0];
    res.json({
      id: row.id,
      title: row.title,
      description: row.description,
      course: row.course,
      dueDate: row.duedate,
      createdAt: row.createdat,
      status: row.status,
      attachmentName: row.attachmentname,
      author: row.author,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/homeworks/:id
app.delete('/api/homeworks/:id', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM homeworks WHERE id = $1', [req.params.id]);
    res.json({ message: 'Deleted', changes: result.rowCount });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Announcement Endpoints
app.get('/api/announcements', async (req, res) => {
  try {
    const { data } = await axios.get('https://ydyo.ankaramedipol.edu.tr/blog/category/duyurular/');
    const $ = cheerio.load(data);
    const announcements = [];

    $('.posts_group.lm_wrapper.classic.col-3 .post-item').each((index, element) => {
      const $element = $(element);

      const title = $element.find('.post-title a').text().trim();
      const content = $element.find('.post-excerpt').text().trim();
      const date = $element.find('.date_label').text().trim();
      const link = $element.find('.post-title a').attr('href');

      // Determine category based on content or title keywords (simple logic)
      let category = 'bilgi';
      const text = (title + ' ' + content).toLowerCase();
      if (text.includes('sınav') || text.includes('exam')) {
        category = 'sinav';
      } else if (text.includes('etkinlik') || text.includes('event') || text.includes('kulüp')) {
        category = 'etkinlik';
      } else if (text.includes('önemli') || text.includes('important') || text.includes('acil')) {
        category = 'onemli';
      }

      announcements.push({
        id: index + 1,
        title,
        content,
        date,
        category,
        pinned: false,
        author: 'YDYO',
        link
      });
    });

    res.json(announcements);
  } catch (error) {
    console.error('Error fetching announcements:', error);
    res.status(500).json({ error: 'Failed to fetch announcements' });
  }
});

app.post('/api/announcement-details', async (req, res) => {
  try {
    const { url } = req.body;
    console.log('Fetching details for:', url);
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    // Use .first() to avoid concatenating text from multiple matching elements
    let title = $('.post-title').first().text().trim();
    if (!title) {
      title = $('.entry-title').first().text().trim();
    }
    if (!title) {
      title = $('h1').first().text().trim();
    }

    const date = $('.date_label').first().text().trim();

    // Try multiple possible content selectors
    const selectors = [
      '.section.the_content.has_content .the_content_wrapper', // User specified target
      '.post-wrapper-content', // Primary target
      '.column_one_fourth .post-wrapper-content', // Specific wrapper
      '.post-content',
      '.entry-content',
      '.blog-post-content',
      '#content',
      'article',
      '.section_wrapper', // Another common wrapper
      '.muffin_builder_content'
    ];

    let foundContent = null;

    // Iterate through selectors to find the best match
    for (const selector of selectors) {
      let fallback = $(selector).html();
      if (fallback && fallback.trim().length > 0) {
        foundContent = fallback;
        break; // Stop at the first valid selector found (prioritizing user request)
      }
    }

    if (foundContent) {
      // Clean up
      const $content = cheerio.load(foundContent, null, false);
      $content('.share-box').remove();
      $content('.related-posts').remove();
      $content('.post-footer').remove();

      // Transform relative URLs to absolute
      $content('a, img, iframe, source, object, embed').each((i, el) => {
        const $el = $content(el);
        ['href', 'src', 'data'].forEach(attr => {
          const val = $el.attr(attr);
          if (val && val.startsWith('/')) {
            $el.attr(attr, 'https://ydyo.ankaramedipol.edu.tr' + val);
          }
        });
      });

      // Fix PDF display: Transform PDF objects/embeds/links into Google Docs Viewer iframe
      $content('object[data$=".pdf"], embed[src$=".pdf"]').each((i, el) => {
        const pdfUrl = $content(el).attr('data') || $content(el).attr('src');
        if (pdfUrl) {
          const viewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(pdfUrl)}&embedded=true`;
          const iframe = `<iframe src="${viewerUrl}" width="100%" height="800px" style="border: none;"></iframe>`;
          $content(el).replaceWith(iframe);
        }
      });

      // Also look for direct PDF links and append a viewer if it's the main content
      $content('a[href$=".pdf"]').each((i, el) => {
        const pdfUrl = $content(el).attr('href');
        // Check if there is already a viewer for this PDF to avoid duplication
        if (!$content(`iframe[src*="${encodeURIComponent(pdfUrl)}"]`).length) {
          const viewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(pdfUrl)}&embedded=true`;
          const iframe = `<div style="margin-top: 20px;"><iframe src="${viewerUrl}" width="100%" height="800px" style="border: none;"></iframe></div>`;
          $content(el).after(iframe);
        }
      });

      res.json({ title, content: $content.html(), date });
      return;
    }

    // If really nothing found, return error
    res.json({ title, content: '<p>İçerik formatı algılanamadı. Lütfen <a href="' + url + '" target="_blank">orijinal siteden</a> görüntüleyiniz.</p>', date });
  } catch (error) {
    console.error('Error fetching announcement details:', error);
    res.status(500).json({ error: 'Failed to fetch details' });
  }
});

// Serve static files from the Vite build output
app.use(express.static(path.join(__dirname, 'dist')));

// SPA fallback — all non-API routes serve index.html
app.get('{*path}', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
