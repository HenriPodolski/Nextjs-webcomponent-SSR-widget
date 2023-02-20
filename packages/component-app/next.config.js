/** @type {import('next').NextConfig} */
const { withWidgetCompilerPlugin } = require('./widgetBuild/widgetCompiler');
const nextConfig = () => {
  const plugins = [/*withWidgetCompilerPlugin*/];
  return plugins.reduce((acc, next) => next(acc), {
    reactStrictMode: true,
    webpack: (config) => config
  });
}

module.exports = nextConfig
