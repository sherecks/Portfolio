function preloadImages() {
    var images = [
        'images/bbb.webp',
        'images/favicon.png',
        'images/4k_7_1.webp',
        'images/4k_7_2.webp',
        'images/4k_7_4.webp',
        'images/tshitblue2.webp',
        'images/sala2.webp',
        'images/sala3.webp',
        'images/brumed.webp',
        'images/kimarco-1.webp',
        'images/capoeira insta.webp',
    ];

    images.forEach(function(image) {
        var img = new Image();
        img.decoding = 'async';
        img.fetchPriority = 'low';
        img.src = image;
    });
}

if (document.readyState === 'complete') {
    preloadImages();
} else {
    window.addEventListener('load', preloadImages);
}