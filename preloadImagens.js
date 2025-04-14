function preloadImages() {
    var images = [
        'images/4K_7_1.png',
        'images/4K_7_2.png',
        'images/4K_7_4.png',
        'images/BR4.png',
        'images/BBB.png',
        'images/BR3.png',
        'images/h1.png',
        'images/h2.png',
        'images/h3.png',
        'images/h4.png',
        'images/tshit2.png',
        'images/TshitBlue2.png',
        'images/TshitBlue3.png',
        'images/favicon.png',
        'images/smilodon.png',
        'images/boat.png',
        'images/carta1.png',
        'images/carta2.png',
        'images/carta3.png',
        'images/screen6.png',
        'images/screen7.png',
        'images/screen8.png',
    ];

    images.forEach(function(image) {
        var img = new Image();
        img.src = image;
    });
}

window.addEventListener('load', preloadImages);