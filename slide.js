var images = [
    'images/berma.png',
    'images/Hat.png',
    'images/berma2.png',
    'images/HatL.png',
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