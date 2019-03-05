const path = require('path');

module.exports = {
    mode: 'development',
    entry: "./src/cyber/main.ts",
    output: {
        filename: "bundle.js"
    },
    resolve: {
        // options for resolving module requests
        // (does not apply to resolving to loaders)
        modules: [ path.resolve(__dirname, 'src'), path.resolve(__dirname, 'node_modules') ],
        // directories where to look for modules
        extensions: [ ".ts", ".js", ".json" ],

        alias: {
            'oimo$': path.resolve(__dirname, 'lib/OimoPhysics.min.js')
        }
    },
    module: {
        rules: [
          // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
          { test: /\.ts/, loader: "ts-loader" }
        ]
    }
}