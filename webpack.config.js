const path = require('path');

module.exports = {
    mode: 'development',
    entry: "./dist/cyber/main.js",
    output: {
        filename: "bundle.js"
    },
    resolve: {
        // options for resolving module requests
        // (does not apply to resolving to loaders)
        modules: [
            path.resolve(__dirname, "node_modules"),
            path.resolve(__dirname, "dist")
        ],
        // directories where to look for modules
        extensions: [".js"],
      }
}