var images = [
    'images/tshit1.png',
    'images/tshit2.png',
    'images/tshit5.png',
    'images/tshit4.png',
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