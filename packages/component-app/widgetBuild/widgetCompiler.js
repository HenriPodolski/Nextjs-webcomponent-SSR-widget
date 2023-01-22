class WidgetCompilerPlugin {
    constructor(publicRuntimeConfig, webpackConfig, webpack) {
        console.dir(webpackConfig, {
            depth: null
        });
    }

    apply(compiler) {
        compiler.hooks.beforeRun.tapPromise('WidgetCompilerPlugin', () => this.compileWidgets())
    }

    compileWidgets() {
        return new Promise((resolve, reject) => {
            console.log('WidgetCompilerPlugin process is starting!');
            console.log('Building widgets');
            resolve();
        });
    }
}

const withWidgetCompilerPlugin = (nextConfig) => {
    let publicRuntimeConfig = nextConfig.publicRuntimeConfig || {PUBLIC_BASE_URL: ''}
    return {
        ...nextConfig,
        webpack: (webpackConfig, options) => {
            const { isServer, webpack } = options;

            if (typeof nextConfig.webpack === 'function') {
               webpackConfig = nextConfig.webpack(webpackConfig, options);
            }

            if (isServer) {
                return webpackConfig;
            }

            return {
                ...webpackConfig,
                plugins: [...webpackConfig.plugins, new WidgetCompilerPlugin(publicRuntimeConfig, webpackConfig, webpack)]
            }
        }
    }
}

module.exports = {
    withWidgetCompilerPlugin
};