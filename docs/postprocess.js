const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'iap_implementation_guide.html');
let html = fs.readFileSync(filePath, 'utf8');

// Replace blockquotes with beautiful alert divs
const alertTypes = [
  { md: 'NOTE', title: '💡 Note', class: 'note' },
  { md: 'IMPORTANT', title: '⚠️ Important', class: 'important' },
  { md: 'WARNING', title: '🔸 Warning', class: 'warning' },
  { md: 'CAUTION', title: '🛑 Caution', class: 'caution' },
  { md: 'TIP', title: '✨ Tip', class: 'success' }
];

alertTypes.forEach(alert => {
  // Regex to match blockquotes containing [!TYPE]
  // Pandoc renders blockquotes as:
  // <blockquote>
  // <p>[!TYPE]<br />
  // ...</p>
  // </blockquote>
  const regex = new RegExp(
    `<blockquote>\\s*<p>\\[!${alert.md}\\]([\\s\\S]*?)</p>\\s*</blockquote>`,
    'g'
  );

  html = html.replace(regex, (match, content) => {
    // Clean up content: remove initial break tag or extra spaces
    let cleanContent = content.trim();
    if (cleanContent.startsWith('<br />')) {
      cleanContent = cleanContent.substring(6).trim();
    }
    return `
<div class="alert alert-${alert.class}">
  <div class="alert-title">${alert.title}</div>
  <p style="margin: 0; color: inherit;">${cleanContent}</p>
</div>`;
  });
});

// Wrap the whole output in a container div for centered, professional reading width
if (!html.includes('<div class="container">')) {
  html = html.replace('<body>', '<body>\n<div class="container">');
  html = html.replace('</body>', '</div>\n</body>');
}

// Beautify layout title and header tags
html = html.replace(
  '<title></title>',
  '<title>Yugma Premium IAP Integration Guide</title>'
);

fs.writeFileSync(filePath, html, 'utf8');
console.log('Post-processed HTML file successfully with premium design enhancements.');
