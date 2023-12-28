# Image dithering algorithms app
#### Video Demo:  https://youtu.be/AoYENxlY63k
#### Description:
It is a web-based application for applying various dithering effects to images.
Dithering is a technique used to create the illusion of color depth in images with a limited color palette.
It's useful in contexts where color resources are limited, such as in  "retro video games" or printing.

User can upload images and select an algorithm.
Kernels used include Floyd-Steinberg, Stucki, Burkes, and more, offering users a variety of dithering styles.
Upon upload, the image is rendered onto an HTML canvas element.

When a dithering effect is chosen, the algorithm processes the image pixel-by-pixel based on the selected kernel.