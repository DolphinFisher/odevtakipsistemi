import axios from 'axios';
import * as cheerio from 'cheerio';

const url = 'https://ydyo.ankaramedipol.edu.tr/blog/2026/02/13/13-02-english-proficiency-exam-results/';

async function analyze() {
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    
    const selectors = [
      '.section.the_content.has_content .the_content_wrapper',
      '.post-wrapper-content',
      '.column_one_fourth .post-wrapper-content',
      '.post-content', 
      '.entry-content', 
      '.blog-post-content',
      '#content',
      'article',
      '.section_wrapper',
      '.muffin_builder_content'
    ];

    console.log('--- Checking Selectors ---');
    selectors.forEach(sel => {
        const html = $(sel).html();
        if (html && html.trim().length > 0) {
            console.log(`Selector "${sel}": FOUND (${html.length} chars)`);
        } else {
            console.log(`Selector "${sel}": NOT FOUND`);
        }
    });

  } catch (error) {
    console.error(error);
  }
}

analyze();
