import axios from 'axios';
import * as cheerio from 'cheerio';

const listUrl = 'https://ydyo.ankaramedipol.edu.tr/blog/category/duyurular/';

async function analyze() {
  try {
    console.log('Fetching list to find a PDF post...');
    const { data: listData } = await axios.get(listUrl);
    const $list = cheerio.load(listData);
    
    let targetUrl = '';
    
    // Try to find a post that might have a PDF
    $list('.post-item').each((i, el) => {
        const title = $list(el).find('.post-title a').text().trim();
        if (title.includes('TRACK 3 CLASS LIST') || title.includes('RESULTS') || title.includes('SONUÇLARI')) {
            targetUrl = $list(el).find('.post-title a').attr('href');
            console.log(`Found candidate: ${title} -> ${targetUrl}`);
            return false; // break
        }
    });

    if (!targetUrl) {
        console.log('No candidate found, using the first post.');
        targetUrl = $list('.post-item').first().find('.post-title a').attr('href');
    }

    console.log(`Analyzing: ${targetUrl}`);
    const { data } = await axios.get(targetUrl);
    const $ = cheerio.load(data);
    
    // Find content
    const selectors = [
      '.section.the_content.has_content .the_content_wrapper',
      '.post-wrapper-content',
      '.post-content', 
      '.entry-content'
    ];

    let content = '';
    for (const sel of selectors) {
        if ($(sel).length) {
            content = $(sel).html();
            console.log(`Found content in: ${sel}`);
            break;
        }
    }

    if (content) {
        const $c = cheerio.load(content, null, false);
        
        console.log('--- IFRAMES ---');
        $c('iframe').each((i, el) => {
            console.log($(el).attr('src'));
        });

        console.log('--- OBJECTS ---');
        $c('object').each((i, el) => {
            console.log($(el).attr('data'));
        });

        console.log('--- EMBEDS ---');
        $c('embed').each((i, el) => {
            console.log($(el).attr('src'));
        });

        console.log('--- PDF LINKS ---');
        $c('a[href$=".pdf"]').each((i, el) => {
            console.log($(el).attr('href'));
        });
        
        console.log('--- RELATIVE SRCs ---');
        $c('[src^="/"]').each((i, el) => {
            console.log($(el).attr('src'));
        });
    } else {
        console.log('No content found.');
    }

  } catch (error) {
    console.error(error);
  }
}

analyze();
