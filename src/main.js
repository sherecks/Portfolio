import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { SplitText } from 'gsap/SplitText';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { buildNetwork } from './network.js';

gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText, DrawSVGPlugin, MotionPathPlugin);

const root = document.documentElement;
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
root.classList.add('is-loading');

const smoother = reduced ? null : ScrollSmoother.create({
  wrapper: '#smooth-wrapper', content: '#smooth-content', smooth: 1.1, effects: false, smoothTouch: false,
});
const getScroll = () => (smoother ? smoother.scrollTop() : scrollY);

// ---------- campo de partículas ----------
let field = null;
async function initField() {
  if (reduced) return;
  try {
    const { createField } = await import('./field.js');
    field = createField($('#field'), $('.hero-title'), getScroll);
    root.classList.add('has-webgl');
  } catch (err) {
    console.warn('WebGL indisponível, seguindo sem partículas', err);
  }
}

// ---------- loader ----------
async function boot() {
  const count = $('.loader-count');
  const n = { v: 0 };
  const counting = gsap.to(n, { v: 100, duration: reduced ? 0.01 : 1.4, ease: 'power2.inOut',
    onUpdate: () => { count.textContent = String(Math.round(n.v)).padStart(3, '0'); } });
  await document.fonts.ready;
  await initField();
  await counting;
  await gsap.to('#loader', { clipPath: 'inset(0 0 100% 0)', duration: reduced ? 0.01 : 0.9, ease: 'expo.inOut' });
  root.classList.remove('is-loading');
  ScrollTrigger.refresh();
  intro();
}

function intro() {
  if (field) gsap.to(field.state, { intro: 1, duration: 2.6, ease: 'expo.out' });
  if (reduced) return;
  gsap.from('.hero-meta span, .hero-roles a, .hero-scroll', { y: 20, opacity: 0, stagger: 0.06, duration: 1, ease: 'expo.out', delay: 0.4 });
  gsap.from('.nav > *', { y: -20, opacity: 0, stagger: 0.05, duration: 0.8, ease: 'expo.out', delay: 0.6 });
}

// ---------- cor por seção ----------
const navLabel = $('.nav-section');
const GLYPHS = '01#+*:.<>/';
function scramble(el, text) {
  const p = { t: 0 };
  gsap.to(p, { t: 1, duration: 0.5, ease: 'none', onUpdate() {
    const k = Math.floor(text.length * p.t);
    el.textContent = text.slice(0, k) + [...text.slice(k)].map((c) => (c === ' ' ? ' ' : GLYPHS[(Math.random() * GLYPHS.length) | 0])).join('');
  } });
}
function setSection(sec) {
  const color = sec.dataset.accent;
  gsap.to(root, { '--accent': color, duration: 0.8, ease: 'power2.out' });
  if (field) {
    const c = new (field.color.constructor)(color);
    gsap.to(field.color, { r: c.r, g: c.g, b: c.b, duration: 1, ease: 'power2.out' });
  }
  scramble(navLabel, sec.dataset.label);
  $$('.nav-links a').forEach((a) => a.classList.toggle('is-active', a.getAttribute('href') === `#${sec.id}`));
}
$$('main > section').forEach((sec) => {
  ScrollTrigger.create({ trigger: sec, start: 'top 55%', end: 'bottom 55%', onToggle: (s) => s.isActive && setSection(sec) });
});

// ---------- hero → nuvem ----------
ScrollTrigger.create({
  trigger: '#topo', start: 'top top', end: 'bottom top', scrub: true,
  onUpdate: (s) => { if (field) field.state.scroll = s.progress; },
});
$$('.hero-roles a').forEach((a) => a.style.setProperty('--c', a.dataset.c));
if (!reduced) gsap.to('.hero-meta, .hero-roles', { y: -80, opacity: 0, ease: 'none', scrollTrigger: { trigger: '#topo', start: 'top top', end: '60% top', scrub: true } });

// ---------- títulos ----------
if (!reduced) {
  $$('.section-title, .contact-big').forEach((el) => {
    const split = SplitText.create(el, { type: 'lines', mask: 'lines', linesClass: 'title-mask' });
    gsap.from(split.lines, { yPercent: 110, duration: 1.2, stagger: 0.08, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 85%' } });
  });
  $$('.kicker').forEach((el) => {
    ScrollTrigger.create({ trigger: el, start: 'top 90%', once: true, onEnter: () => scramble(el, el.textContent) });
  });
}

// ---------- sobre ----------
if (!reduced) {
  const words = SplitText.create('.about-text', { type: 'words', wordsClass: 'word' }).words;
  gsap.to(words, { opacity: 1, stagger: 0.1, ease: 'none', scrollTrigger: { trigger: '.about-text', start: 'top 75%', end: 'bottom 45%', scrub: true } });
}
$$('.stat-num').forEach((el) => {
  const to = +el.dataset.to;
  if (reduced) { el.textContent = to; return; }
  const o = { v: 0 };
  ScrollTrigger.create({ trigger: el, start: 'top 85%', once: true,
    onEnter: () => gsap.to(o, { v: to, duration: 1.6, ease: 'expo.out', onUpdate: () => { el.textContent = Math.round(o.v); } }) });
});

// ---------- rede Meta + trilhas horizontais (layouts diferentes por tela) ----------
const mm = gsap.matchMedia();
mm.add({ wide: '(min-width: 901px)', narrow: '(max-width: 900px)', reduce: '(prefers-reduced-motion: reduce)' }, (ctx) => {
  const { wide, reduce } = ctx.conditions;
  buildNetwork($('.network-graph'), $('.network-steps'), { wide, pinned: wide && !reduce, reduce });

  if (wide && !reduce) {
    $$('.h-pin').forEach((pin) => {
      const track = $('.h-track', pin);
      const dist = () => Math.max(0, track.scrollWidth - innerWidth);
      gsap.to(track, { x: () => -dist(), ease: 'none',
        scrollTrigger: { trigger: pin, pin: true, scrub: 1, end: () => `+=${dist()}`, invalidateOnRefresh: true } });
    });
  }
});

// ---------- produtos: mockup entra pelo lado, texto sobe ----------
if (!reduced) {
  $$('.product').forEach((p, i) => {
    const tl = gsap.timeline({ scrollTrigger: { trigger: p, start: 'top 78%' } });
    tl.from($('.shot', p), { x: i % 2 ? 80 : -80, opacity: 0, duration: 1.2, ease: 'expo.out' })
      .from($$('.product-info > *', p), { y: 30, opacity: 0, stagger: 0.08, duration: 0.9, ease: 'expo.out' }, '<0.15');
  });
}

// ---------- vídeos: só toca o que está na tela ----------
const io = new IntersectionObserver((entries) => {
  entries.forEach(({ target: v, isIntersecting }) => {
    if (isIntersecting) {
      if (!v.src) v.src = v.dataset.src;
      v.play().catch(() => {});
    } else if (!v.paused) v.pause();
  });
}, { rootMargin: '200px 200px' });
$$('video[data-src]').forEach((v) => {
  if (reduced) { v.removeAttribute('loop'); return; } // sem autoplay: fica o pôster
  io.observe(v);
});

// ---------- player ----------
const dlg = $('.player');
const pv = $('video', dlg);
$$('.vcard').forEach((b) => b.addEventListener('click', () => {
  pv.src = b.dataset.full; pv.muted = false;
  dlg.showModal(); pv.play().catch(() => {});
}));
$('.player-close').addEventListener('click', () => dlg.close());
dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });
dlg.addEventListener('close', () => { pv.pause(); pv.removeAttribute('src'); pv.load(); });

// ---------- cursor ----------
const cursor = $('.cursor');
if (matchMedia('(hover: hover)').matches) {
  const cx = gsap.quickTo(cursor, 'x', { duration: 0.25, ease: 'power3' });
  const cy = gsap.quickTo(cursor, 'y', { duration: 0.25, ease: 'power3' });
  addEventListener('pointermove', (e) => { cx(e.clientX); cy(e.clientY); });
  const label = $('.cursor-label');
  document.addEventListener('pointerover', (e) => {
    const t = e.target.closest('[data-cursor], a, button');
    cursor.classList.toggle('is-hover', !!t);
    label.textContent = t?.dataset.cursor ?? '';
  });
}

// ---------- âncoras ----------
$$('a[href^="#"]').forEach((a) => a.addEventListener('click', (e) => {
  const target = $(a.getAttribute('href'));
  if (!target) return;
  e.preventDefault();
  if (smoother) smoother.scrollTo(target, true, 'top top');
  else target.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
}));

boot();
