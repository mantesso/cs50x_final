window.onload = function () {
  const img = document.getElementById("sourceImage");
  const w = img.width;
  const h = img.height;

  var canvas = document.getElementById("imageCanvas");
  var ctx = canvas.getContext("2d");

  canvas.width = img.width;
  canvas.height = img.height;
  ctx.drawImage(img, 0, 0);

  var imageData = ctx.getImageData(0, 0, img.width, img.height);
  data = imageData.data;

  // adds the getPixel method to the (image)data object
  // and return an array [R, G, B, A]
  data.getPixel = function (x, y) {
    var i = (x + y * img.width) * 4;
    return [this[i], this[i + 1], this[i + 2], this[i + 3]];
  };

  data.setPixel = function (x, y, r, g, b, a = 255) {
    var i = (x + y * img.width) * 4;
    this[i] = r;
    this[i + 1] = g;
    this[i + 2] = b;
    this[i + 3] = a;
  };

  // convert to gray scale
  function grayScale(data) {
    for (var i = 0, loop = data.length; i < loop; i += 4) {
      let average = (data[i] + data[i + 1] + data[i + 2]) / 3;
      data[i] = average;
      data[i + 1] = average;
      data[i + 2] = average;
    }
  }
  // grayScale(data);

  // random dither
  function randomDither(data) {
    for (var i = 0, loop = data.length; i < loop; i += 4) {
      // Returns a random integer from 0 to 255:
      let random = Math.floor(Math.random() * 256);
      if (random > data[i]) {
        data[i] = 0;
        data[i + 1] = 0;
        data[i + 2] = 0;
      } else {
        data[i] = 255;
        data[i + 1] = 255;
        data[i + 2] = 255;
      }
    }
  }
  // randomDither(data);

  function index(x, y) {
    return (x + y * img.width) * 4;
  }

  function findClosestPaletteColor(value, steps = 1) {
    return Math.round((steps * value) / 255) * Math.floor(255 / steps);
  }

  // gray levels
  function grayLevels(data, levels) {
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        let [oldR, oldG, oldB] = data.getPixel(x, y);
        let average = (oldR + oldG + oldB) / 3;
        let newColor = findClosestPaletteColor(average, levels);

        data.setPixel(x, y, newColor, newColor, newColor);
      }
    }
  }
  grayLevels(data, 4);

  // Floyd-Steinberg Dithering
  function floydDither(data) {
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        let [oldR, oldG, oldB] = data.getPixel(x, y);
        let newR = findClosestPaletteColor(oldR);
        let newG = findClosestPaletteColor(oldG);
        let newB = findClosestPaletteColor(oldB);
        data.setPixel(x, y, newR, newG, newB);

        let errorR = oldR - newR;
        let errorG = oldG - newG;
        let errorB = oldB - newB;

        distributeError(x + 1, y, errorR, errorG, errorB, 7 / 16);
        distributeError(x - 1, y + 1, errorR, errorG, errorB, 3 / 16);
        distributeError(x, y + 1, errorR, errorG, errorB, 5 / 16);
        distributeError(x + 1, y + 1, errorR, errorG, errorB, 1 / 16);
      }
    }
  }

  // grayScale(data);
  // floydDither(data);

  function distributeError(x, y, errorR, errorG, errorB, fraction) {
    if (x < 0 || x >= img.width || y < 0 || y >= img.height) return;
    let [r, g, b] = data.getPixel(x, y);
    // console.log(data.getPixel(x, y));
    r = r + errorR * fraction;
    g = g + errorG * fraction;
    b = b + errorB * fraction;
    // console.log(r, g, b);
    data.setPixel(x, y, r, g, b);
  }

  ctx.putImageData(imageData, 0, 0);
};
