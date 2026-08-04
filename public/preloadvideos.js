function preloadVideos() {
    var videos = [
        'images/expo.mp4',
        'images/texol.mp4',
        'images/ecatarina.mp4',
        'images/lycra soulfins.mp4',
        'images/capoeira reels.mp4',
    ];

    videos.forEach(function(video) {
        var videoElement = document.createElement('video');
        videoElement.src = video;
        videoElement.preload = 'metadata';
    });
}

if (document.readyState === 'complete') {
    preloadVideos();
} else {
    window.addEventListener('load', preloadVideos);
}