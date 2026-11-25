const singleSpaAngularWebpack = require('single-spa-angular/lib/webpack').default;

module.exports = (config, options) => {
  const singleSpaWebpackConfig = singleSpaAngularWebpack(config, options);

  // Angular already emits source maps via its own SourceMapDevToolPlugin. single-spa-angular
  // additionally sets `devtool: 'source-map'`, which makes webpack emit main.js.map twice
  // ("Conflict: Multiple assets emit different content to the same filename main.js.map").
  if (singleSpaWebpackConfig.plugins.some((plugin) => plugin.constructor.name === 'SourceMapDevToolPlugin')) {
    singleSpaWebpackConfig.devtool = false;
  }

  // Add rule for raw-loader on CSS with ?raw query (optional but safer)
  singleSpaWebpackConfig.module.rules.push({
    test: /\.css$/,
    resourceQuery: /raw/, // only applies when importing like: import '...css?raw'
    use: ['raw-loader'],
  });

  return singleSpaWebpackConfig;
};
