(function () {
    'use strict';

    var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) return;

    var BG_TILE_SIZE = 220;
    var BG_TILE_CELL = 12;
    var BG_FILL_CHANCE = 0.22;
    var BG_CHARS = ['.', ':', '+', '*', '#'];

    var dpr = Math.min(window.devicePixelRatio || 1, 2);

    var bgCanvas = document.createElement('canvas');
    bgCanvas.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:-1;';
    var bgCtx = bgCanvas.getContext('2d');

    function buildBgTile() {
        var tile = document.createElement('canvas');
        tile.width = BG_TILE_SIZE;
        tile.height = BG_TILE_SIZE;
        var tctx = tile.getContext('2d');
        tctx.font = BG_TILE_CELL + 'px monospace';
        tctx.textBaseline = 'top';

        var cols = Math.ceil(BG_TILE_SIZE / BG_TILE_CELL);
        var rows = Math.ceil(BG_TILE_SIZE / BG_TILE_CELL);

        for (var row = 0; row < rows; row++) {
            for (var col = 0; col < cols; col++) {
                if (Math.random() > BG_FILL_CHANCE) continue;
                var ch = BG_CHARS[Math.floor(Math.random() * BG_CHARS.length)];
                var alpha = (0.05 + Math.random() * 0.07).toFixed(3);
                tctx.fillStyle = 'rgba(0,0,0,' + alpha + ')';
                tctx.fillText(ch, col * BG_TILE_CELL, row * BG_TILE_CELL);
            }
        }
        return tile;
    }

    function paintBackground() {
        var w = window.innerWidth;
        var h = window.innerHeight;
        bgCanvas.width = Math.round(w * dpr);
        bgCanvas.height = Math.round(h * dpr);
        bgCanvas.style.width = w + 'px';
        bgCanvas.style.height = h + 'px';
        bgCtx.setTransform(dpr, 0, 0, dpr, 0, 0);

        var pattern = bgCtx.createPattern(buildBgTile(), 'repeat');
        bgCtx.fillStyle = pattern;
        bgCtx.fillRect(0, 0, w, h);
    }

    function start() {
        document.body.appendChild(bgCanvas);
        paintBackground();
    }

    var resizeTimer;
    window.addEventListener('resize', function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(paintBackground, 150);
    });

    if (document.readyState === 'complete') {
        start();
    } else {
        window.addEventListener('load', start);
    }
})();
