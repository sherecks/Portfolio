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
    const file = Bun.file(new URL(relative, dist));

    if (await file.exists()) {
      return new Response(file);
    }

    return new Response('Not found', { status: 404 });
  },
});

console.log(`Portfólio servido em http://localhost:${port}`);
