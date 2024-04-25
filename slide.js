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
    'images/tshit1.png',
  ];

  var num = 0;

  function btn(){
  var image = document.getElementById("image");
  num++;
  if ( num >= images.length ) {
    num = 0;
  }
  image.src = images[num];
}