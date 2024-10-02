function preloadImages() {
    var images = [
        'images/2.png',
        'images/3.png',
        'images/4.png',
        'images/1.png',
        'images/BR1.png',
        'images/BR3.png',
        'images/BR2.png',
        'images/tshit1.png',
        'images/tshit2.png',
        'images/tshit5.png',
        'images/tshit4.png',
        'images/l1.png',
        'images/l2.png',
        'images/h4.png',
        'images/h3.png',
        
    ];

    images.forEach(function(image) {
        var img = new Image();
        img.src = image;
    });
}

window.addEventListener('load', preloadImages);