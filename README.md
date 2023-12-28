# Image Dithering Algorithms App

#### Video Demo: [https://youtu.be/AoYENxlY63k](https://youtu.be/AoYENxlY63k)

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


