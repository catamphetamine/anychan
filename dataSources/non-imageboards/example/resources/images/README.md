Images here are encoded as "data URI"s because Node.js doesn't know how to import `*.svg` file extension. This code is executed not only when running the app with Webpack via `yarn dev` but also when running tests via `yarn test` where there're no Webpack loaders.