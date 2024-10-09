function preloadImages() {
    var images = [
        'images/4K_7_1.png',
        'images/4K_7_2.png',
        'images/4K_7_4.png',
        'images/Kimarco-1.png',
        'images/BR4.png',
        'images/BR3.png',
        'images/l1.png',
        'images/l2.png',
        'images/TshitBlue2.png',
        'images/TshitBlue3.png',
    ];

    images.forEach(function(image) {
        var img = new Image();
        img.src = image;
    });
}

window.addEventListener('load', preloadImages);