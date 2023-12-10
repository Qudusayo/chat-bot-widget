const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = function override(config, env) {
  if (env === "production") {
    // For production build, disable source maps
    config.devtool = false; // Set to false to completely disable source maps
  }

  config.plugins = config.plugins.map((plugin) => {
    if (plugin.constructor.name === "MiniCssExtractPlugin") {
      return new MiniCssExtractPlugin({
        filename: "static/css/chat-bot.css", // Customize the CSS file name here
        chunkFilename: "static/css/chat-bot.[id].css",
      });
    }
    return plugin;
  });

  // Modify the output configuration for JavaScript files
  config.output = {
    filename: "static/js/chat-bot.js",
    chunkFilename: "static/js/chat-bot.[name].js",
    path: path.resolve(__dirname, "build"),
  };

  return config;
};
