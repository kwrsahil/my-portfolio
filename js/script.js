function setLang(lang) {
  document.body.setAttribute('data-lang', lang);
  const btn = document.getElementById('lang-toggle-btn');
  btn.textContent = lang === 'en' ? 'JP' : 'EN';
  localStorage.setItem('lang', lang);
}

function toggleLang() {
  const current = document.body.getAttribute('data-lang');
  setLang(current === 'en' ? 'jp' : 'en');
}

function detectLang() {
  const saved = localStorage.getItem('lang');
  if (saved) return saved;
  const locale = navigator.language || navigator.userLanguage || '';
  return locale.startsWith('ja') ? 'jp' : 'en';
}

setLang(detectLang());

const obs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');
function onScroll() {
  let current = '';
  sections.forEach(s => {
    const top = s.getBoundingClientRect().top;
    if (top <= 120) current = s.id;
  });
  navLinks.forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + current);
  });
}

window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

fetch('https://api.github.com/repos/kwrsahil/shift-tracker/git/refs/tags')
  .then(r => r.json())
  .then(tags => {
    if (!Array.isArray(tags) || !tags.length) return;
    const latest = tags[tags.length - 1].ref.replace('refs/tags/', '');
    document.getElementById('version-badge').textContent = latest;
    const pv = document.getElementById('project-version');
    if (pv) pv.textContent = latest;
  })
  .catch(() => {});
  
document.addEventListener('DOMContentLoaded', () => {
  const u = 'sahilkunwarofficial';
  const d = 'gmail.com';
  const el = document.getElementById('contact-email');
  if (el) {
    el.href = 'mailto:' + u + '@' + d;
    el.appendChild(document.createTextNode(u + '@' + d));
  }
});
