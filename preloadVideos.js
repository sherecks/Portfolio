function preloadVideos() {
    var videos = [
        'images/Filme-1.mp4',
    ];

    videos.forEach(function(video) {
        var videoElement = document.createElement('video');
        videoElement.src = video;
        videoElement.preload = 'auto';
    });
}

window.addEventListener('load', preloadVideos);