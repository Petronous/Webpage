function clamp(min, value, max) {
  if (value < min) return min;
  if (value > max) return max;
  return value;
}

function blendY(x,y, dr, cw, j){
  yy = Math.floor(y);
  i1 = (x + (yy+0)*cw);
  i2 = (x + (yy+1)*cw);
  part = y - yy;
  if (y <= 3) {
    y = y;
  }
  return dr[i1*4 + j]*part + dr[i2*4 + j]*(1-part)
}

var drops = [];
var speeds= [];

function update() {
  console.log("update")
  var canvas = document.getElementById('canvas');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  //openFullscreen(canvas)
  var ctx = canvas.getContext('2d');
  var canvasWidth = canvas.width;
  var canvasHeight = canvas.height;
  //ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  var id = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
  if (drops.length == canvasWidth*canvasHeight*4) {
    var pixels = drops.slice();
    var dropsref=drops;
  }
  else {
    var pixels = id.data;
    var dropsref=id.data;
  }
  if (speeds.length == 0) {
    for (var i = 0; i < canvasWidth; i++) {
      speeds.push(Math.random()*3 + 1);
    }
  }
  for (var i = 0; i < canvasWidth; i++) {
    if (Math.random() > 0.99) speeds[i] = (Math.random()*4-1);
  }
  for (var i = canvasHeight*canvasWidth*4 - 4; i >= canvasWidth*4*4; i -= 4) {
    //console.log(i)
    left = Math.random()/10 - 0.05;
    right= Math.random()/10 - 0.05;
    x = Math.floor(i/4) % canvasWidth;
    y = Math.floor(i/4  / canvasWidth);

    for (var j = 0; j < 4; j++) {
      if (true) {
        left = 0;
        right= 0;
      }
      pixels[i + j] = clamp(0, Math.floor((  blendY(x,y-speeds[x], dropsref, canvasWidth, j)   +    left*dropsref[i - 4 - canvasWidth*4 + j] + right*dropsref[i + 4 - canvasWidth*4 + j])/(1)), 255);
    }
  }
  for (var i = 0; i < canvasWidth*4*4; i+=4) {
    if (i == 0) console.log(pixels[i+2])
    if (pixels[i+2] == 0 && Math.random() > 0.95){
      var r = Math.floor(Math.random() * 255);
      pixels[i    ] = Math.max(0, r - 20);
      pixels[i + 1] = r;
      pixels[i + 2] = Math.min(255, r + 20);
      pixels[i + 3] = 255;
    } else {
      for(let j = 0; j < 3; j++) {
        pixels[i + j] = clamp(0, pixels[i+j] - 5, 255);
      }
    }
  }
  nid = new ImageData(pixels, canvasWidth, canvasHeight);
  console.log(nid.data[0]);
  console.log(pixels[0]);
  drops = pixels;
  ctx.putImageData(nid, 0, 0);
  return i;
}

function openFullscreen(elem) {
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.mozRequestFullScreen) { /* Firefox */
    elem.mozRequestFullScreen();
  } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) { /* IE/Edge */
    elem.msRequestFullscreen();
  }
}
