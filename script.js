const floydSteinbergKernel = [
  { offsetX: 1, offsetY: 0, fraction: 7 / 16 },
  { offsetX: -1, offsetY: 1, fraction: 3 / 16 },
  { offsetX: 0, offsetY: 1, fraction: 5 / 16 },
  { offsetX: 1, offsetY: 1, fraction: 1 / 16 },
];

const falseFloydSteinbergKernel = [
  { offsetX: 1, offsetY: 0, fraction: 3 / 8 },
  { offsetX: 0, offsetY: 1, fraction: 3 / 8 },
  { offsetX: 1, offsetY: 1, fraction: 2 / 8 },
];

const stuckiKernel = [
  { offsetX: 1, offsetY: 0, fraction: 8 / 42 },
  { offsetX: 2, offsetY: 0, fraction: 4 / 42 },
  { offsetX: -2, offsetY: 1, fraction: 2 / 42 },
  { offsetX: -1, offsetY: 1, fraction: 4 / 42 },
  { offsetX: 0, offsetY: 1, fraction: 8 / 42 },
  { offsetX: 1, offsetY: 1, fraction: 4 / 42 },
  { offsetX: 2, offsetY: 1, fraction: 2 / 42 },
  { offsetX: -2, offsetY: 2, fraction: 1 / 42 },
  { offsetX: -1, offsetY: 2, fraction: 2 / 42 },
  { offsetX: 0, offsetY: 2, fraction: 4 / 42 },
  { offsetX: 1, offsetY: 2, fraction: 2 / 42 },
  { offsetX: 2, offsetY: 2, fraction: 1 / 42 },
];

const burkesKernel = [
  { offsetX: 1, offsetY: 0, fraction: 8 / 32 },
  { offsetX: 2, offsetY: 0, fraction: 4 / 32 },
  { offsetX: -2, offsetY: 1, fraction: 2 / 32 },
  { offsetX: -1, offsetY: 1, fraction: 4 / 32 },
  { offsetX: 0, offsetY: 1, fraction: 8 / 32 },
  { offsetX: 1, offsetY: 1, fraction: 4 / 32 },
  { offsetX: 2, offsetY: 1, fraction: 2 / 32 },
];

const sierra3Kernel = [
  { offsetX: 1, offsetY: 0, fraction: 5 / 32 },
  { offsetX: 2, offsetY: 0, fraction: 3 / 32 },
  { offsetX: -2, offsetY: 1, fraction: 2 / 32 },
  { offsetX: -1, offsetY: 1, fraction: 4 / 32 },
  { offsetX: 0, offsetY: 1, fraction: 5 / 32 },
  { offsetX: 1, offsetY: 1, fraction: 4 / 32 },
  { offsetX: 2, offsetY: 1, fraction: 2 / 32 },
  { offsetX: -1, offsetY: 2, fraction: 2 / 32 },
  { offsetX: 0, offsetY: 2, fraction: 3 / 32 },
  { offsetX: 1, offsetY: 2, fraction: 2 / 32 },
];

const sierra2Kernel = [
  { offsetX: 1, offsetY: 0, fraction: 4 / 16 },
  { offsetX: 2, offsetY: 0, fraction: 3 / 16 },
  { offsetX: -2, offsetY: 1, fraction: 1 / 16 },
  { offsetX: -1, offsetY: 1, fraction: 2 / 16 },
  { offsetX: 0, offsetY: 1, fraction: 3 / 16 },
  { offsetX: 1, offsetY: 1, fraction: 2 / 16 },
  { offsetX: 2, offsetY: 1, fraction: 1 / 16 },
];

const sierra24AKernel = [
  { offsetX: 1, offsetY: 0, fraction: 2 / 4 },
  { offsetX: -2, offsetY: 1, fraction: 1 / 4 },
  { offsetX: -1, offsetY: 1, fraction: 1 / 4 },
];

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
  randomDither(data);

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
  // grayLevels(data, 4);

  function applyDithering(data, kernel) {
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

        kernel.forEach(({ offsetX, offsetY, fraction }) => {
          distributeError(
            x + offsetX,
            y + offsetY,
            errorR,
            errorG,
            errorB,
            fraction
          );
        });
      }
    }
  }

  // grayScale(data);
  // applyDithering(data, sierra24AKernel);

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
    // return if x and y values are outside of img limits
    if (x < 0 || x >= img.width || y < 0 || y >= img.height) return;

    let [r, g, b] = data.getPixel(x, y);
    r = r + errorR * fraction;
    g = g + errorG * fraction;
    b = b + errorB * fraction;
    data.setPixel(x, y, r, g, b);
  }

  ctx.putImageData(imageData, 0, 0);
};
