// Simple markdown parser - no external dependencies
export function parseMarkdown(text: string): string {
  let html = text;

  // Escape HTML first
  html = html
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Code blocks (```code```)
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, code) => {
    return `<pre class="code-block" data-lang="${lang}"><code>${code.trim()}</code></pre>`;
  });

  // Inline code (`code`)
  html = html.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>');

  // Bold (**text** or __text__)
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/__([^_]+)__/g, '<strong>$1</strong>');

  // Italic (*text* or _text_)
  html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  html = html.replace(/_([^_]+)_/g, '<em>$1</em>');

  // Links [text](url)
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');

  // Unordered lists
  html = html.replace(/^[\s]*[-*]\s+(.+)$/gm, '<li>$1</li>');
  html = html.replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>');

  // Ordered lists
  html = html.replace(/^[\s]*\d+\.\s+(.+)$/gm, '<li>$1</li>');

  // Headers
  html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
  html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');

  // Line breaks
  html = html.replace(/\n/g, '<br>');

  return html;
}

// Format timestamp
export function formatTime(timestamp: number): string {
  const date = new Date(timestamp);
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

// Format date
export function formatDate(timestamp: number): string {
  const date = new Date(timestamp);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${month}/${day}`;
}

// Generate fake visitor count
export function getVisitorCount(): number {
  const base = 88432;
  const today = new Date();
  const daysSince2024 = Math.floor((today.getTime() - new Date('2024-01-01').getTime()) / (1000 * 60 * 60 * 24));
  return base + daysSince2024 * 23 + Math.floor(Math.random() * 5);
}

// Generate fake stats
export function getFakeStats() {
  return {
    cpu: Math.floor(Math.random() * 15) + 2,
    ram: Math.floor(Math.random() * 30) + 35,
    network: Math.floor(Math.random() * 100) + 50,
    uptime: '999:99:99',
    users: Math.floor(Math.random() * 50) + 100,
    messages: Math.floor(Math.random() * 1000) + 50000,
  };
}

// Hot keywords
export const hotKeywords = [
  { text: 'AI', weight: 5 },
  { text: 'ChatBot', weight: 4 },
  { text: 'GPT', weight: 5 },
  { text: 'LLM', weight: 3 },
  { text: 'Coding', weight: 4 },
  { text: 'Web', weight: 3 },
  { text: 'JavaScript', weight: 3 },
  { text: 'React', weight: 2 },
  { text: 'Next.js', weight: 2 },
  { text: 'ML', weight: 3 },
  { text: 'API', weight: 2 },
  { text: 'Data', weight: 2 },
  { text: 'Cloud', weight: 2 },
  { text: 'Automation', weight: 3 },
  { text: 'Bot', weight: 2 },
];

// Announcements
export const announcements = [
  '【IMPORTANT】Server maintenance notice (jk)',
  '★NEW FEATURES★ Now even more colorful!',
  'Congrats! 88000 visitors!! Thank you!!',
  '【NOTICE】All ads are fake btw',
  '☆Quote of the day☆ Sleep early, wake early',
  '【URGENT】Not actually urgent at all',
  '♪BGM plays in your imagination♪',
  '【UPDATE】Made the CSS even more chaotic',
  '★Rankings updating★ (not really)',
  '【ANNOUNCE】This site was made in 2003 (lie)',
];

// Site map links
export const siteMapLinks = [
  { name: 'Home', href: '#' },
  { name: 'Chat', href: '#' },
  { name: 'History', href: '#' },
  { name: 'Settings', href: '#' },
  { name: 'Help', href: '#' },
  { name: 'FAQ', href: '#' },
  { name: 'Terms', href: '#' },
  { name: 'Privacy', href: '#' },
  { name: 'Contact', href: '#' },
  { name: 'Feedback', href: '#' },
  { name: 'About', href: '#' },
  { name: 'API', href: '#' },
  { name: 'Docs', href: '#' },
  { name: 'Changelog', href: '#' },
  { name: 'Links', href: '#' },
];

// Recommended links
export const recommendedLinks = [
  { name: 'Super Useful Tools', badge: 'HOT' },
  { name: 'AI Aggregator Site', badge: 'NEW' },
  { name: 'Programmer Daily Life', badge: null },
  { name: 'Tech News Hub', badge: 'REC' },
  { name: 'Free Assets Site', badge: null },
  { name: 'Web Dev 101', badge: 'NEW' },
];

// Rankings
export const rankings = [
  { rank: 1, name: 'GPT-4', change: '→' },
  { rank: 2, name: 'Claude', change: '↑' },
  { rank: 3, name: 'Gemini', change: '↓' },
  { rank: 4, name: 'Llama', change: '↑' },
  { rank: 5, name: 'Mistral', change: 'NEW' },
];
