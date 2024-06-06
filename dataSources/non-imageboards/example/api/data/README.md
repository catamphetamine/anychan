# Example data

Simplifications:

* It doesn't add `createdAt` timestamps to threads or comments just for brevity. A real-world API would've added `createdAt` timestamps though.

* It uses `*.svg` images just for smaller file size. Hence, it doesn't add a `sizes[]` property to any `Picture`. In real life though, pictures would almost always be "raster" rather than "vector" meaning that they'd have a list of smaller `sizes[]`.
