# Image Dithering Algorithms App

#### Description:

This project is a web-based application designed for applying various dithering effects to images. Dithering is an artistic and computational technique used to create the illusion of color depth in images with a limited color palette. By strategically arranging pixels of different colors, dithering simulates gradients and subtle variations, often giving a unique, textured appearance to the images. It's especially useful in contexts where color resources are limited, such as in retro video games, digital art or printing limited colors. The final image is usually much lower in size.

###### Features

- **Image Upload**: Users can upload images, which are then rendered onto an HTML canvas for processing.
- **Dithering Effects**: Multiple dithering algorithms are available, each defined by unique kernels like Floyd-Steinberg, Stucki, and Burkes.
- **Grayscale Conversion**: An optional feature to convert images to grayscale before applying dithering effects.
- **Real-Time Processing**: Instant visual feedback is provided on the canvas as different dithering effects are applied.

#### How It Works

- **Canvas API**: The application uses the HTML5 Canvas API for manipulating image data at the pixel level.
- **ImageData Objects**: Manipulation of images is achieved through ImageData objects, which represent the pixel data of the canvas.
- **JavaScript**: The application is built with JavaScript.

### JavaScript Key Components

- **Dithering Kernels**: Each kernel, such as Floyd-Steinberg, Stucki, or Burkes, dictates a specific way to spread the quantization error of a pixel to its neighbors. This process creates the characteristic patterns of dithering.

- **Canvas API**: The application uses the HTML5 Canvas API to draw and manipulate images. It's a powerful tool that provides pixel-level control over the image, which is essential for dithering.

- **Image Processing Functions**: The script contains functions for grayscale conversion, random dither, and other dithering methods. These functions manipulate the ImageData object's pixel data directly to apply the desired effects.

#### Workflow

1. **Image Upload**: When a user uploads an image, it's loaded into an HTML image element (`img`).
2. **Image Rendering on Canvas**: The image is then drawn onto a canvas, and its data is extracted into an `ImageData` object for pixel manipulation.

3. **Applying Dithering Effects**: When a user selects a dithering effect, the corresponding kernel is used to process the image data. This process involves calculating the error in color quantization and distributing it to neighboring pixels based on the kernel's pattern. The function `applySelectedEffect`: Applies the selected dithering effect to the image by calling another function `applyDithering`. `applyDithering` takes two parameters, the `data` and the `kernel` to use. Those kernels are defined as constants on the top of the file. This choice was made to simplify the code since most kernels require similar processing with the exception of the `grayScale()` and `randomDither()` which don't require kernels as inputs.

4. **Displaying Results**: After processing, the altered image data is put back onto the canvas, allowing the user to see the dithered image result.

#### Global Variables

The script uses global variables like `canvas`, `ctx` (canvas context), `imageData` (original image data), `originalImageData` (backup of the original image data for resets), and dimensions variables (`h` and `w`).

#### Functions

- `handleImageUpload`: Handles the image upload and initializes the image processing. It calls the function `drawImageOnCanvas` which as the name implies, renders the uploaded image to the canvas. This is necessary to do any kind of pixel level manipulation to the image.
- `getResizedDimensions`: Resizes the image to a manageable size while maintaining aspect ratio. If the image is too big, it'll be resized to a maximum width of 800px.
- `saveOriginalImageData`: Saves the original (possibly resized) image data. This choice was necessary to allow the user to change an algorithm after the image was uploaded without the stacking of algorithms. The only option that can be stacked is the `grayScale()` option.
- `resetCanvasToOriginal`: Resets the canvas to the original image data before applying a new effect.
- `extendImageData`: Extends the `ImageData` object with `getPixel` and `setPixel` functions for easier pixel manipulation.

### `ImageData` and RGBA Sequence

- In a canvas, images are represented as an `ImageData` object. This object contains an array (`data`) representing a one-dimensional array of a grid of pixels.
- Each pixel in this array is represented by four values in a sequence: red (R), green (G), blue (B), and alpha (A).
- The RGBA values are stored in a contiguous block. For instance, the first pixel's data occupies the first four indices of the array: [R1, G1, B1, A1], the second pixel's data is at [R2, G2, B2, A2], and so on.

### The `getPixel` Function

- The `getPixel` function retrieves the color data of a specific pixel.
- It calculates the index in the image data array based on the x and y coordinates of the pixel and returns an array with the RGBA values of that pixel.
- For example, `getPixel(x, y)` calculates the index as `(x + y * imageWidth) * 4` and returns the RGBA values at that index.

### The `setPixel` Function

- Conversely, the `setPixel` function updates the color data of a specific pixel.
- It also calculates the index in the same way as `getPixel`.
- This function takes the RGBA values as input and sets them in the image data array at the calculated index. If the alpha value is not provided, it defaults to 255 (fully opaque).

### `applyDithering` and `distributeError` functions

The function iterates over each pixel in the image using nested loops. The outer loop runs vertically (y-axis), and the inner loop runs horizontally (x-axis).
For each pixel, it retrieves the original color values (red, green, blue) using the `data.getPixel` method. It then quantizes these color values using the `findClosestPaletteColor` function, which reduces the color to its nearest value in a limited palette (typically black or white for monochrome dithering). The quantized color is set back to the pixel using `data.setPixel`. The quantization error is achieved by calling the `distributeError` function.

`distributeError` function distributes the quantization error to neighboring pixels. It takes six parameters - x and y coordinates of the current pixel, the errors in red, green, and blue color channels (`errorR`, `errorG`, `errorB`), and the fraction of the error to be distributed (defined in the kernel).
The function first checks if the neighboring pixel coordinates are within the image bounds. If not, it simply returns without doing anything. For each neighboring pixel, it adds a portion of the quantization error to the pixel's color values. This portion is determined by the `fraction` parameter which is a part of the kernel.
