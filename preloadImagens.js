function preloadImages() {
    var images = [
        'images/tshit2.png',
        'images/tshit1.png',
        'images/tshit4.png',
        

    ];

    images.forEach(function(image) {
        var img = new Image();
        img.src = image;
    });
}

window.addEventListener('load', preloadImages);