var images = [
    'images/tshit2.png',
    'images/berma2.png',
    'images/berma.png',
    'images/tshit7.png',
    'images/tshit8.png',
    'images/Hat.png',
    'images/HatL.png',
    'images/tshit3.png',
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