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