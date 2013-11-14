
function makeTransparent (image, color, alpha) {
  var canvas = document.createElement('canvas'),
      cx     = canvas.getContext('2d');
  
  if (!alpha) alpha = 0;
  
  canvas.width  = image.width;
  canvas.height = image.height;
  
  cx.drawImage(image, 0, 0);
  
  var imageData = cx.getImageData(0, 0, image.width, image.height);
  
  var r = color>>16&0xff,
      g = color>> 8&0xff,
      b = color    &0xff,
      d = imageData.data;
  
  for (var i = 0; i < d.length; i += 4) {
    if (d[i] == r && d[i+1] == g && d[i+2] == b) {
      d[i+3] = alpha;
    }
  }
  
  cx.putImageData(imageData, 0, 0);
  
  var img = new Image();
  
  img.src = canvas.toDataURL('image/png');
  
  return img;
}

var xn =  95.047,
    yn = 100.000,
    zn = 108.883;

function rgb2xyz (rgb) {
  var r = rgb[0],
      g = rgb[1],
      b = rgb[2];
      
  return [ (0.49000*r + 0.31000*g + 0.20000*b)/0.17697
         , (0.17697*r + 0.81240*g + 0.01063*b)/0.17697
         , (0.00000*r + 0.01000*g + 0.99000*b)/0.17697
         ];
}

function xyz2rgb (xyz) {
  var x = xyz[0],
      y = xyz[1],
      z = xyz[2];
      
  return [  0.41847000*x + -0.1586600*y + -0.082835*z
         , -0.09116900*x +  0.2524300*y +  0.015708*z
         ,  0.00092090*x + -0.0025498*y +  0.178600*z
         ];
}

function xyz2lab_f (t) {
  if (t > Math.pow(6/29, 3)) {
    return Math.pow(t, 1/3);
  } else {
    return (1/3)*Math.pow(29/6, 2)*t + 4/29;
  }
}

function xyz2lab (xyz) {
  var x = xyz[0],
      y = xyz[1],
      z = xyz[2];
      
  return [ 116*(xyz2lab_f(y/yn)) - 16
         , 500*(xyz2lab_f(x/xn) - xyz2lab_f(y/yn))
         , 200*(xyz2lab_f(y/yn) - xyz2lab_f(z/zn))
         ];
}

function lab2xyz_f (t) {
  if (t > 6/29) {
    return Math.pow(t, 3);
  } else {
    return 3*Math.pow(6/29, 2)*(t - 4/29);
  }
}

function lab2xyz (lab) {
  var l = lab[0],
      a = lab[1],
      b = lab[2];
      
  return [ xn*lab2xyz_f((l+16)/116 + a/500)
         , yn*lab2xyz_f((l+16)/116)
         , zn*lab2xyz_f((l+16)/116 - b/200)
         ];
}

function rgb2lab (rgb) {
  return xyz2lab(rgb2xyz(rgb));
}

function lab2rgb (lab) {
  return xyz2rgb(lab2xyz(lab));
}

function rgbstr (rgb) {
  return 'rgb(' + Math.round(rgb[0]) + ',' + Math.round(rgb[1]) + ',' + Math.round(rgb[2]) + ')';
}

function loadImage (src, done) {
  var img = new Image();
  
  img.src = src;
  
  img.onload = function(){
    done(null, img);
  };
  
  img.onerror = function(e){
    done('Error loading ' + src + ': ' + e.message);
  };
}

function getContext (id, width, height) {
  var canvas = document.getElementById(id);
  
  if (width && height) {
    canvas.width  = width;
    canvas.height = height;
  }
  
  return canvas.getContext('2d');
}

function newCanvas (width, height) {
  var canvas = document.createElement('canvas');
  
  canvas.width  = width;
  canvas.height = height;
  
  return canvas;
}
