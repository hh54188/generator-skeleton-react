const path = require("path");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const HappyPack = require("happypack");

const PUBLIC_DIR_PATH = path.join(__dirname, "public");

module.exports = {
  entry: {
    app: "./src/index.js"
  },
  output: {
    filename: "[name].bundle.js",
    path: PUBLIC_DIR_PATH,
    // publicPath 非常重要，决定了页面引用的资源相对于的路径是什么
    // 默认相对于页面路径加载
    // 需要修改为相对于服务器路径加载
    // https://webpack.js.org/configuration/output/#output-publicpath
    publicPath: "/"
  },
  plugins: [
    new CleanWebpackPlugin(["public/**/*.js", "public/**/*.map"]),
    new HappyPack({
      loaders: [
        {
          loader: "babel-loader",
          cacheDirectory: true
        }
      ]
    })
  ],
  module: {
    loaders: [
      {
        test: /\.css$/,
        loaders: ["style-loader", "css-loader"]
      },
      {
        test: /\.js|jsx$/,
        exclude: /node_modules/,
        use: "happypack/loader"
      },
      {
        test: /\.less$/,
        // 因为需要引入 /node_modules/antd 中的 .less 变量，
        // 所以不能排除 /node_modules/ 文件夹
        // exclude: /node_modules/,
        loaders: [
          "style-loader",
          "css-loader",
          {
            loader: "less-loader",
            options: {
              javascriptEnabled: true
            }
          }
        ]
      },
      {
        test: /\.(png|woff|woff2|eot|ttf|svg)$/,
        loader: "url-loader?limit=100000"
      }
    ]
  }
};
