const path = require('path'); // подключаем path к конфигу вебпак
const MiniCssExtractPlugin = require("mini-css-extract-plugin"); // подключили к проекту плагин
const HtmlWebpackPlugin = require('html-webpack-plugin'); // подключили плагин
const WebpackMd5Hash = require('webpack-md5-hash');
const webpack = require('webpack'); // подключаем cross-env — environment variables (от англ. «переменные окружения»)

module.exports = { // module.exports — это синтаксис экспорта в Node.js 
  entry: { main: './src/index.js' }, // указали первое место куда заглянет webpack — файл index.js в папке src
  output: { // указали в какой файл будет собирться весь js и дали ему имя 
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[chunkhash].js' // после установки md5-hash, до того filename: 'main.js'
  },

  module: {
    rules: [{ // тут описываются правила
        test: /\.js$/, // регулярное выражение, которое ищет все js файлы
        use: { loader: "babel-loader" }, // весь js обрабатывается пакетом babel-loader
        exclude: /node_modules/ // исключаем папку node_modules
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader'] // приминяем установленные пакеты. 'postcss-loader' добавили после установки плагинов для CSS
      },
      {// настройки image-webpack-loader
        test: /\.(png|jpg|gif|ico|svg)$/,
        use: [
          'file-loader?name=../images/[name].[ext]', // папка куда складывать картинки
          {
            loader: 'image-webpack-loader',
            options: {}
          },
        ]
      },
      { // подгружаем шрифты
        test: /\.(woff(2)?|eot|ttf|otf)(\?v=\d+\.\d+\.\d+)?$/i,
        use: [{
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            outputPath: 'fonts/'
          }            
        }]
      }
    ]
  },

  plugins: [
    new MiniCssExtractPlugin({ // вызов функции
      filename: 'style.[contenthash].css'
    }),
    new HtmlWebpackPlugin({
      inject: false, // стили не нужно прописывать внутри тегов
      // после установки md5-hash запись hash: true, для страницы нужно считать хеш, — удаляем
      template: './src/index.html', // откуда брать образец для сравнения с текущим видом проекта
      filename: 'index.html' // имя выходного файла, который окажется в dist после сборки
    }),
    new webpack.DefinePlugin({ // подключаем cross-env
      'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    })
  ]
};