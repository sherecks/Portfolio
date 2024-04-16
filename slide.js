var images = [
    'images/tshit1.png',
    'images/tshit2.png',
    'images/tshit4.png',
    'images/tshit3.png',
    'images/tshit5.png',
    'images/tshit6.png',
    'images/tshit7.png',
    'images/tshit10.png',
    'images/tshit8.png',
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