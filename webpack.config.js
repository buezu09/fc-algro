const { resolve } = require('path');
const { version } = require('uikit/package.json');

const Encore = require('@symfony/webpack-encore');
const paths = {
    pattern: /\.(jpe?g|png|gif|svg|webp)$/i,
    public: 'public/build',
    source: resolve(__dirname, './assets'),
    vendor: resolve(__dirname, './node_modules'),
};

// Manually configure the runtime environment if not already configured yet by the "encore" command.
// It's useful when you use tools that rely on webpack.config.js file.
if (!Encore.isRuntimeEnvironmentConfigured()) {
    Encore.configureRuntimeEnvironment(process.env.NODE_ENV || 'dev');
}

Encore
    // directory where compiled assets will be stored
    .setOutputPath('public/build/')
    // public path used by the web server to access the output path
    .setPublicPath('/build')
    // only needed for CDN's or sub-directory deploy
    //.setManifestKeyPrefix('build/')

    /*
     * ENTRY CONFIG
     *
     * Add 1 entry for each "page" of your app
     * (including one that's included on every page - e.g. "app")
     *
     * Each entry will result in one JavaScript file (e.g. app.js)
     * and one CSS file (e.g. app.css) if your JavaScript imports CSS.
     */
    .addEntry('js/app', `${paths.source}/js/app.js`)

    // Copy and optimize images
    .copyFiles({
        from: `${paths.source}/images`,
        pattern: paths.pattern,
        to: '[path][name].[ext]',
        context: './assets',
    })

    .configureBabel(() => {}, {
        includeNodeModules: ['uikit'],
        useBuiltIns: 'usage',
        corejs: 3,
    })

    .configureDefinePlugin((options) => {
        options.VERSION = JSON.stringify(version);
    })

    // When enabled, Webpack "splits" your files into smaller pieces for greater optimization.
    //.splitEntryChunks()

    // will require an extra script tag for runtime.js
    // but, you probably want this, unless you're building a single-page app
    .disableSingleRuntimeChunk()

    /*
     * FEATURE CONFIG
     *
     * Enable & configure other features below. For a full
     * list of features, see:
     * https://symfony.com/doc/current/frontend.html#adding-more-features
     */
    .cleanupOutputBeforeBuild()
    .enableBuildNotifications()
    .enableSourceMaps(!Encore.isProduction())
    // enables hashed filenames (e.g. app.abc123.css)
    // .enableVersioning(Encore.isProduction())

    // enables @babel/preset-env polyfills
    .configureBabelPresetEnv((config) => {
        config.useBuiltIns = 'usage';
        config.corejs = 3;
    })

    // enables Sass/SCSS support
    .enableSassLoader(() => {}, { resolveUrlLoader: false })

    .addAliases({ 
        'uikit-util': `${paths.vendor}/uikit/src/js/util`,
        '@symfony/stimulus-bridge/controllers.json': resolve(__dirname, './assets/controllers.json')
    })

// uncomment if you use TypeScript
//.enableTypeScriptLoader()

// uncomment to get integrity="..." attributes on your script & link tags
// requires WebpackEncoreBundle 1.4 or higher
//.enableIntegrityHashes(Encore.isProduction())

// uncomment if you're having problems with a jQuery plugin
//.autoProvidejQuery()

// uncomment if you use API Platform Admin (composer require api-admin)
//.enableReactPreset()
//.addEntry('admin', './assets/admin.js')
;

const config = Encore.getWebpackConfig();
config.watchOptions = {
    poll: true,
}

module.exports = config;
