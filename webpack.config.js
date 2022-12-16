const package = require('./package.json');
const { merge } = require("webpack-merge");
const singleSpaDefaults = require("webpack-config-single-spa-ts");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = (webpackConfigEnv, argv) => {
  const orgName = "hippobyte";

  const defaultConfig = singleSpaDefaults({
    orgName,
    projectName: "host",
    webpackConfigEnv,
    argv,
    disableHtmlGeneration: true,
  });

  return merge(defaultConfig, {
    plugins: [
      new HtmlWebpackPlugin({
        inject: false,
        template: "src/index.ejs",
        templateParameters: {
          isLocal: webpackConfigEnv && webpackConfigEnv.isLocal,
          orgName,
        },
      }),
    ],
    output: {
      filename: (pathData) => {
        if (webpackConfigEnv.production) {
          const namespace = package.name.split('@').pop().split('/').join('.');
          return pathData.chunk.name === 'main' ? `${namespace}.[name]${contenthash}.js` : `${namespace}.[name]/${namespace}.[name]${contenthash}.js`;
        } else {
          const namespace = package.name.split('@').pop().split('/').join('-');
          return pathData.chunk.name === 'main' ? `${namespace}.js` : `${namespace}/[name].js`;
        }
      }
    }
  });
};
