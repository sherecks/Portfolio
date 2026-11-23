import gsap from 'gsap';

// Índice 0 é a Business Manager: uma moldura que contém Meta Ads e WhatsApp, não uma etapa do fluxo.
const NODES = [
  { label: 'Meta Business Manager', text: 'Onde ficam os anúncios e o número de WhatsApp. Configuro acessos, tokens e permissões para tudo conversar.' },
  { label: 'Meta Ads', sub: 'Campanhas e criativos', text: 'O anúncio capta o lead, e o gasto de cada criativo fica registrado.' },
  { label: 'WhatsApp Cloud API', sub: 'Mensageria', text: 'O lead recebe a primeira mensagem por um template aprovado pela Meta, já com os dados dele.' },
  { label: 'AI SDR', sub: 'Agente de IA', text: 'A IA conversa, tira dúvidas e qualifica o lead, com tom e abordagem ajustados a cada nicho.' },
  { label: 'CRM', sub: 'HubSpot · Pipedrive · RD', text: 'Cada avanço do lead entra no CRM sozinho, por integração nativa ou webhook.' },
  { label: 'ADX', sub: 'Painel de CPQL', text: 'Cruza gasto e funil para mostrar qual criativo vende e qual deve ser pausado.' },
];
// arestas na ordem em que são desenhadas; a última é o gasto indo direto do anúncio para o painel
const EDGE_LABELS = ['lead', 'conversa', 'qualificado', 'funil', 'gasto por criativo'];

const W = 210, H = 64;
const LAYOUTS = {
  wide: {
    box: '0 0 1000 500',
    frame: [20, 30, 600, 150],
    nodes: [null, [150, 110], [500, 110], [860, 110], [860, 400], [150, 400]],
    edges: [
      [[255, 110], [395, 110]], [[605, 110], [755, 110]], [[860, 142], [860, 368]],
      [[755, 400], [255, 400]], [[150, 142], [150, 368]],
    ],
    labels: [[325, 100, 'middle'], [680, 100, 'middle'], [874, 259, 'start'], [505, 390, 'middle'], [164, 259, 'start']],
  },
  tall: {
    box: '0 0 600 830',
    frame: [20, 30, 560, 270],
    nodes: [null, [150, 110], [450, 240], [150, 420], [450, 580], [450, 760]],
    edges: [
      [[150, 142], [150, 240], [345, 240]], [[450, 272], [450, 420], [255, 420]], [[150, 452], [150, 580], [345, 580]],
      [[450, 612], [450, 728]], [[255, 110], [590, 110], [590, 760], [555, 760]],
    ],
    labels: [[162, 200, 'start'], [462, 350, 'start'], [162, 520, 'start'], [462, 675, 'start'], [580, 440, 'end']],
  },
};

const NS = 'http://www.w3.org/2000/svg';
const el = (tag, attrs, parent) => {
  const n = document.createElementNS(NS, tag);
  for (const k in attrs) n.setAttribute(k, attrs[k]);
  parent?.appendChild(n);
  return n;
};
const toPath = (pts) => 'M' + pts.map((p) => p.join(' ')).join(' L');

export function buildNetwork(svg, list, { wide, pinned, reduce }) {
  const L = wide ? LAYOUTS.wide : LAYOUTS.tall;
  svg.innerHTML = '';
  svg.setAttribute('viewBox', L.box);
  list.innerHTML = NODES.map((n) => `<li><b>${n.label}</b>${n.text}</li>`).join('');
  const steps = [...list.children];

  const [fx, fy, fw, fh] = L.frame;
  const frame = el('g', { class: 'node frame' }, svg);
  el('rect', { x: fx, y: fy, width: fw, height: fh, rx: 10 }, frame);
  el('text', { x: fx + 16, y: fy + 22 }, frame).textContent = NODES[0].label;

  const edgesG = el('g', {}, svg);
  const live = L.edges.map((pts, i) => {
    const d = toPath(pts);
    el('path', { d, class: 'edge', 'stroke-dasharray': i === 4 ? '4 6' : 'none' }, edgesG);
    return el('path', { d, class: 'edge-live' }, edgesG);
  });
  L.labels.forEach(([x, y, anchor], i) => {
    el('text', { x, y, 'text-anchor': anchor, class: 'edge-label' }, svg).textContent = EDGE_LABELS[i];
  });

  const nodes = [frame, ...L.nodes.slice(1).map(([x, y], k) => {
    const g = el('g', { class: 'node', transform: `translate(${x - W / 2} ${y - H / 2})` }, svg);
    el('rect', { width: W, height: H, rx: 6 }, g);
    el('text', { x: 16, y: 28 }, g).textContent = NODES[k + 1].label;
    el('text', { x: 16, y: 46, class: 'sub' }, g).textContent = NODES[k + 1].sub;
    return g;
  })];

  // pulsos de dados correndo pelas linhas (pausados até o diagrama terminar)
  const pulses = gsap.timeline({ paused: true, repeat: -1 });
  live.forEach((path, i) => {
    const dot = el('circle', { r: 4, class: 'pulse', opacity: 0 }, svg);
    pulses.to(dot, { opacity: 1, duration: 0.1 }, i * 0.35)
      .to(dot, { motionPath: { path, align: path, alignOrigin: [0.5, 0.5] }, duration: 1.6, ease: 'none' }, i * 0.35)
      .to(dot, { opacity: 0, duration: 0.15 }, i * 0.35 + 1.45);
  });

  const setActive = (idx, current = idx) => {
    nodes.forEach((n, k) => n.classList.toggle('is-on', k <= idx));
    steps.forEach((s, k) => s.classList.toggle('is-on', current === -1 ? true : k === current));
  };

  if (reduce) { setActive(NODES.length - 1, -1); return; }

  gsap.set(live, { drawSVG: '0%' });

  if (pinned) {
    // tempo 0: moldura; tempo 1: Meta Ads; cada linha seguinte acende o próximo nó
    const tl = gsap.timeline({
      scrollTrigger: { trigger: '.network-pin', pin: true, start: 'top top', end: '+=2400', scrub: 0.6 },
      onUpdate() {
        const idx = Math.min(NODES.length - 1, Math.floor(this.time() + 0.001));
        setActive(idx);
        if (this.progress() > 0.98) pulses.play(); else pulses.pause(0);
      },
    });
    tl.to({}, { duration: 1 });
    for (let i = 0; i < 4; i++) tl.to(live[i], { drawSVG: '100%', duration: 1, ease: 'none' });
    tl.to(live[4], { drawSVG: '100%', duration: 1.4, ease: 'none' });
    setActive(0);
    return;
  }

  gsap.timeline({ scrollTrigger: { trigger: svg, start: 'top 75%', once: true }, onComplete: () => pulses.play() })
    .add(() => setActive(NODES.length - 1, -1))
    .to(live, { drawSVG: '100%', duration: 0.6, stagger: 0.3, ease: 'power1.inOut' });
}
