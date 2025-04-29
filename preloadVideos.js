function preloadVideos() {
    var videos = [
        'images/expo.mp4',
        'images/Texol.mp4',
        'images/Ecatarina.mp4',
        'images/Vila.mp4',
        'images/GHOST.mp4',
        'images/TWIX5045.mp4',
        'images/Lycra Soulfins.mp4',
        'images/Kimarcovid.mp4',
        'images/Capoeira Reels.mp4',
        'images/Syn.mp4',
    ];

    videos.forEach(function(video) {
        var videoElement = document.createElement('video');
        videoElement.src = video;
        videoElement.preload = 'auto';
    });
}

window.addEventListener('load', preloadVideos);