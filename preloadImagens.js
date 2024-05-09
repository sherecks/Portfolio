function preloadImages() {
    var images = [
        'images/berma.png',
        'images/Hat.png',
        'images/cargo2.png',
        'images/berma2.png',
        'images/fleece.png',
        'images/HatL.png',
        'images/cargo.png',
        'images/fleece2.png',
        'images/tshit2.png',
        'images/cargo3.png',
        'images/fleece3.png',
        'images/berma3.png',
        'images/fleece4.png',
        'images/tshit1.png',
        'images/prev.png',
        'images/next.png',

    ];

    images.forEach(function(image) {
        var img = new Image();
        img.src = image;
    });
}

window.addEventListener('load', preloadImages);