import * as THREE from 'three';

// Campo de partículas: forma o nome do hero (uMorph = 0) e se desfaz numa nuvem que reage ao mouse (uMorph = 1).
const vertex = /* glsl */ `
  attribute vec2 aText;
  attribute vec3 aCloud;
  attribute float aSeed;
  attribute float aAmb;
  uniform float uMorph, uTime, uScroll, uDpr;
  uniform vec2 uRes, uMouse;
  varying float vAlpha;
  varying float vMix;
  varying vec3 vText;

  // gradiente verde (#7CFF4F) ↔ azul (#4F7CFF), em ciclo suave
  vec3 palette(float h) {
    return mix(vec3(0.486, 1.0, 0.31), vec3(0.31, 0.486, 1.0), 0.5 - 0.5 * cos(6.2831853 * h));
  }

  void main() {
    vec2 t = aText - vec2(0.0, uScroll);
    t += vec2(sin(uTime * 2.0 + aSeed * 40.0), cos(uTime * 1.7 + aSeed * 30.0)) * 0.7;
    // "música" sem áudio: batida a 120 bpm + ondas correndo pelo nome, com força variando por coluna (tipo equalizador)
    float beat = pow(1.0 - fract(uTime * 2.0), 8.0);
    float eq = 0.5 + 0.5 * sin(aText.x * 0.021 + uTime * 4.3) * sin(aText.x * 0.006 - uTime * 1.1);
    t.y += sin(aText.x * 0.011 - uTime * 3.2) * (2.0 + 7.0 * eq + 5.0 * beat);
    t += vec2(sin(aSeed * 44.0), cos(aSeed * 31.0)) * beat * 2.5;

    vec2 c = aCloud.xy;
    c += vec2(sin(c.y * 0.004 + uTime * 0.3 + aSeed * 6.28), cos(c.x * 0.004 + uTime * 0.25 + aSeed * 6.28)) * 40.0 * aCloud.z;
    c.y = mod(c.y - uScroll * (0.05 + 0.25 * aCloud.z), uRes.y * 1.2) - uRes.y * 0.1;

    float m = max(aAmb, smoothstep(aSeed * 0.5, aSeed * 0.5 + 0.5, uMorph));
    vec2 p = mix(t, c, m);

    vec2 d = p - uMouse;
    p += normalize(d + 0.0001) * smoothstep(150.0, 0.0, length(d)) * 70.0;

    gl_Position = vec4(p.x / uRes.x * 2.0 - 1.0, 1.0 - p.y / uRes.y * 2.0, 0.0, 1.0);
    gl_PointSize = mix(2.2 * (1.0 + beat * 0.3), 1.0 + 2.6 * aCloud.z, m) * uDpr;
    vAlpha = mix(0.95, 0.12 + 0.55 * aCloud.z, m);
    vMix = m;
    // a cor corre pelo nome junto com a onda e clareia na batida
    vText = mix(palette(aText.x / uRes.x * 0.9 - uTime * 0.12), vec3(1.0), beat * 0.35);
  }
`;

const fragment = /* glsl */ `
  uniform vec3 uColor;
  varying float vAlpha;
  varying float vMix;
  varying vec3 vText;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    gl_FragColor = vec4(mix(vText, uColor, vMix), vAlpha * smoothstep(0.5, 0.15, d));
  }
`;

// Amostra os pixels do título (mesma fonte e posição do DOM) e devolve pontos em coordenadas da página.
function sampleTitle(el, getScroll, gap) {
  const style = getComputedStyle(el);
  const size = parseFloat(style.fontSize);
  const w = innerWidth, h = document.documentElement.scrollHeight;
  const rect = el.getBoundingClientRect();
  const top = rect.top + getScroll();
  const cvs = document.createElement('canvas');
  const pad = Math.ceil(size * 0.5); // espaço acima da linha: o til do "Ã" passa da caixa do texto e era cortado
  cvs.width = w; cvs.height = Math.ceil(rect.height + size + pad);
  const ctx = cvs.getContext('2d', { willReadFrequently: true });
  ctx.font = `${style.fontWeight} ${size}px ${style.fontFamily}`;
  if ('fontStretch' in ctx) ctx.fontStretch = 'expanded';
  ctx.fillStyle = '#fff';
  ctx.textBaseline = 'alphabetic';
  const ascent = ctx.measureText('J').fontBoundingBoxAscent || size * 0.9;

  // uma Range por palavra pega a posição real de cada linha quebrada
  const node = el.firstChild;
  const text = node.textContent;
  const re = /\S+/g;
  let mt;
  while ((mt = re.exec(text))) {
    const r = document.createRange();
    r.setStart(node, mt.index); r.setEnd(node, mt.index + mt[0].length);
    const wr = r.getBoundingClientRect();
    const word = style.textTransform === 'uppercase' ? mt[0].toUpperCase() : mt[0];
    // estica a palavra para a largura real do DOM (o canvas não tem o eixo wdth)
    const natural = ctx.measureText(word).width;
    ctx.save();
    ctx.translate(wr.left, wr.top - rect.top + ascent + pad);
    ctx.scale(wr.width / natural, 1);
    ctx.fillText(word, 0, 0);
    ctx.restore();
  }

  const data = ctx.getImageData(0, 0, cvs.width, cvs.height).data;
  const pts = [];
  for (let y = 0; y < cvs.height; y += gap)
    for (let x = 0; x < cvs.width; x += gap)
      if (data[(y * cvs.width + x) * 4 + 3] > 128) pts.push(x, y + top - pad);
  return { pts, w, h };
}

export function createField(canvas, titleEl, getScroll) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: false, powerPreference: 'high-performance' });
  const dpr = Math.min(devicePixelRatio || 1, 2);
  renderer.setPixelRatio(dpr);
  renderer.setClearColor(0x050505, 1);

  const mobile = innerWidth < 800;
  const COUNT = mobile ? 5000 : 11000;
  const scene = new THREE.Scene();
  const camera = new THREE.Camera(); // o shader já projeta em clip space
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(COUNT * 3), 3));
  const aText = new THREE.BufferAttribute(new Float32Array(COUNT * 2), 2);
  const aCloud = new THREE.BufferAttribute(new Float32Array(COUNT * 3), 3);
  const aSeed = new THREE.BufferAttribute(new Float32Array(COUNT), 1);
  const aAmb = new THREE.BufferAttribute(new Float32Array(COUNT), 1);
  geo.setAttribute('aText', aText); geo.setAttribute('aCloud', aCloud);
  geo.setAttribute('aSeed', aSeed); geo.setAttribute('aAmb', aAmb);

  const uniforms = {
    uMorph: { value: 1 }, uTime: { value: 0 }, uScroll: { value: 0 }, uDpr: { value: dpr },
    uRes: { value: new THREE.Vector2(innerWidth, innerHeight) },
    uMouse: { value: new THREE.Vector2(-9999, -9999) },
    uColor: { value: new THREE.Color('#5FF5E0') },
  };
  const mat = new THREE.ShaderMaterial({
    vertexShader: vertex, fragmentShader: fragment, uniforms,
    transparent: true, depthTest: false, depthWrite: false, blending: THREE.AdditiveBlending,
  });
  const points = new THREE.Points(geo, mat);
  points.frustumCulled = false;
  scene.add(points);

  function layout() {
    const vw = innerWidth, vh = innerHeight;
    renderer.setSize(vw, vh, false);
    uniforms.uRes.value.set(vw, vh);
    const { pts } = sampleTitle(titleEl, getScroll, mobile ? 4 : 5);
    const n = pts.length / 2;
    for (let i = 0; i < COUNT; i++) {
      const amb = n === 0 || i % 10 < 3 ? 1 : 0; // ~30% fica sempre como poeira de fundo
      const k = Math.floor(Math.random() * Math.max(n, 1)) * 2;
      aText.setXY(i, pts[k] ?? 0, pts[k + 1] ?? 0);
      aCloud.setXYZ(i, (Math.random() * 1.2 - 0.1) * vw, Math.random() * vh * 1.2, Math.random());
      aSeed.setX(i, Math.random());
      aAmb.setX(i, amb);
    }
    aText.needsUpdate = aCloud.needsUpdate = aSeed.needsUpdate = aAmb.needsUpdate = true;
  }
  layout();

  const mouse = { x: -9999, y: -9999 };
  addEventListener('pointermove', (e) => { mouse.x = e.clientX; mouse.y = e.clientY; }, { passive: true });
  document.addEventListener('pointerleave', () => { mouse.x = mouse.y = -9999; });

  let resizeT;
  let lastW = innerWidth;
  addEventListener('resize', () => {
    // no celular a barra de endereço muda a altura o tempo todo; só refaz quando a largura muda
    if (innerWidth === lastW) { renderer.setSize(innerWidth, innerHeight, false); uniforms.uRes.value.set(innerWidth, innerHeight); return; }
    lastW = innerWidth;
    clearTimeout(resizeT); resizeT = setTimeout(layout, 200);
  });

  const state = { scroll: 0, intro: 0 };
  const t0 = performance.now();
  renderer.setAnimationLoop(() => {
    uniforms.uTime.value = (performance.now() - t0) / 1000;
    uniforms.uScroll.value = getScroll();
    uniforms.uMorph.value = Math.max(state.scroll, 1 - state.intro);
    const m = uniforms.uMouse.value;
    if (mouse.x < -999) m.set(-9999, -9999);
    else m.set(m.x < -999 ? mouse.x : m.x + (mouse.x - m.x) * 0.12, m.y < -999 ? mouse.y : m.y + (mouse.y - m.y) * 0.12);
    renderer.render(scene, camera);
  });

  return { state, color: uniforms.uColor.value, relayout: layout };
}
