var images = [
    'images/tshit1.png',
    'images/tshit4.png',
    'images/tshit2.png',
  ];

  var num = 0;
  var image;

  document.addEventListener('DOMContentLoaded', function() {
    image = document.getElementById("image");
  });

  function nextImage() {
    num++;
    if (num >= images.length) {
      num = 0;
    }
    image.src = images[num];
  }
  
  function prevImage() {
    num--;
    if (num < 0) {
      num = images.length - 1;
    }
    image.src = images[num];
  }