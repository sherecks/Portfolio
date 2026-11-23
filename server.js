const port = process.env.PORT || 3000;
const dist = new URL('./dist/', import.meta.url);

const PRETTY_ROUTES = {
  '/': 'index.html',
  // páginas antigas agora são seções da index
  '/3d': 'index.html',
  '/videomaker': 'index.html',
  '/3d.html': 'index.html',
  '/videomaker.html': 'index.html',
  '/curriculo': 'curriculo.html',
};

Bun.serve({
  port,
  async fetch(req) {
    const { pathname } = new URL(req.url);
    const relative = PRETTY_ROUTES[pathname] ?? pathname.slice(1);
    const url = new URL(relative, dist);
    // "//caminho" viraria um caminho absoluto no disco: só serve o que está dentro de dist/
    if (!url.href.startsWith(dist.href)) return new Response('Not found', { status: 404 });
    const file = Bun.file(url);

    if (await file.exists()) {
      return new Response(file);
    }

    return new Response('Not found', { status: 404 });
  },
  // caminho malformado (ex.: barra codificada) não pode mostrar a página de erro com detalhes internos
  error: () => new Response('Not found', { status: 404 }),
});

console.log(`Portfólio servido em http://localhost:${port}`);
