const singleSpaAngularWebpack = require('single-spa-angular/lib/webpack').default;

module.exports = (config, options) => {
  const singleSpaWebpackConfig = singleSpaAngularWebpack(config, options);

  // Add rule for raw-loader on CSS with ?raw query (optional but safer)
  singleSpaWebpackConfig.module.rules.push({
    test: /\.css$/,
    resourceQuery: /raw/, // only applies when importing like: import '...css?raw'
    use: ['raw-loader'],
  });

  return singleSpaWebpackConfig;
};
