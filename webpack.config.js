// webpack.config.js
var Encore = require('@symfony/webpack-encore');

Encore
    // the project directory where all compiled assets will be stored
    .setOutputPath('build/')

    // the public path used by the web server to access the previous directory
    .setPublicPath('/build')

    // will create public/build/app.js and public/build/app.css
    .addEntry('base', './assets/js/base.js')
    .addEntry('filters', './assets/js/form-filters.js')
    .addEntry('context-menu', './assets/js/context-menu.js')
    .addEntry('selectable-columns','./assets/js/selectable-columns.js')

    // enable source maps during development
    .enableSourceMaps(!Encore.isProduction())

    // empty the outputPath dir before each build
    .cleanupOutputBeforeBuild()

    // show OS notifications when builds finish/fail
    .enableBuildNotifications()
    .enableSingleRuntimeChunk()
       
    // create hashed filenames (e.g. app.abc123.css)
    // .enableVersioning()

    // allow sass/scss files to be processed
    .enableSassLoader()
    .configureBabel((config) => {
        config.plugins.push("@babel/plugin-proposal-class-properties");
    })
    .enablePostCssLoader((options) => {
        options.config = {
            path: './postcss.config.js'
         };
    });

// export the final configuration
module.exports = Encore.getWebpackConfig();