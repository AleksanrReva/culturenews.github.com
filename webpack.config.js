const path = require('path'); // подключаем path к конфигу вебпак
const MiniCssExtractPlugin = require("mini-css-extract-plugin"); // подключили к проекту плагин
const HtmlWebpackPlugin = require('html-webpack-plugin'); // подключили плагин
const WebpackMd5Hash = require('webpack-md5-hash');
const webpack = require('webpack'); // подключаем cross-env — environment variables (от англ. «переменные окружения»)
// const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const isDev = process.env.NODE_ENV; // содаём переменную для development-сборки
const ASSET_PATH = process.env.ASSET_PATH || '/';

module.exports = { // module.exports — это синтаксис экспорта в Node.js 
  entry: { index: './src/pages/index/index.js' }, // указали первое место куда заглянет webpack — файл index.js в папке src
  output: { // указали в какой файл будет собирться весь js и дали ему имя 
    path: path.resolve(__dirname, 'dist'),
    filename: 'pages/[name]/[name].[chunkhash].js', // после установки md5-hash, до того filename: 'main.js'
    publicPath: ASSET_PATH // с этой штукой нет ошибки связанной с src="<%=require('../folder/file.ext')%>"
  },

  module: {
    rules: [{ // тут описываются правила
        test: /\.js$/i, // регулярное выражение, которое ищет все js файлы
        use: { loader: "babel-loader" }, // весь js обрабатывается пакетом babel-loader
        exclude: /node_modules/ // исключаем папку node_modules
      },
      {
        test: /\.css$/i,
        use: [
          (isDev ? 'style-loader' :
            {
              loader: MiniCssExtractPlugin.loader,
              options: { publicPath: '../../' }
            }
          ),
          'css-loader',
          'postcss-loader'
        ] // приминяем установленные пакеты. 'postcss-loader' добавили после установки плагинов для CSS
      },
      {// настройки image-webpack-loader
        test: /\.(png|jpg|jpeg|gif)$/i,
        use: [
          //'file-loader?name=./images/[name].[ext]', // папка куда складывать картинки
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              // publicPath: 'images/',
              outputPath: 'images/',
              useRelativePath: true,
              esModule: false,
            }
          },
          { 
            loader: 'image-webpack-loader',
            options: { }
          }
        ]
      },
      {// для иконок
        test: /\.(ico|svg)$/i,
        use: [
          //'file-loader?name=./images/icons/[name].[ext]', // папка куда складывать картинки
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              // publicPath: 'images/icons/', пока не выключил картинки не шли в dist
              outputPath: 'images/icons/',
              useRelativePath: true,
              esModule: false,
            }
          },
          { 
            loader: 'image-webpack-loader',
            options: { }
          }
        ]
      },
      // {
      //   test: /\.css$/i,
      //   // в правиле указываем, что если сборка в режиме dev, то плагин MiniCssExtractPlugin загружать не нужно
      //   use: [
      //     (isDev === 'development' ? 'style-loader' : MiniCssExtractPlugin.loader),
      //     'css-loader',
      //     'postcss-loader'
      //   ]
      // },
      { // подгружаем шрифты
        test: /\.(woff(2)?|eot|ttf|otf)(\?v=\d+\.\d+\.\d+)?$/i,
        use: [{
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            outputPath: 'vendor/fonts/'
          }            
        }]
      }
    ]
  },

  plugins: [
    // new WebpackMd5Hash(),
    new MiniCssExtractPlugin({ // вызов функции
      filename: 'pages/[name]/[name].[contenthash].css'
    }),
    // new OptimizeCssAssetsPlugin({ // этот плагин нужно подключать сюда, после MiniCssExtractPlugin
    //   assetNameRegExp: /\.css$/g,
    //   cssProcessor: require('cssnano'),
    //   cssProcessorPluginOptions: {
    //     preset: ['default'],
    //   },
    //   canPrint: true
    // }),
    new HtmlWebpackPlugin({
      inject: false, // стили не нужно прописывать внутри тегов
      // после установки md5-hash запись hash: true, для страницы нужно считать хеш, — удаляем
      template: './src/pages/index/index.html', // откуда брать образец для сравнения с текущим видом проекта
      filename: 'index.html' // имя выходного файла, который окажется в dist после сборки
    }),
    new webpack.DefinePlugin({ // подключаем cross-env
      'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    }),
    new webpack.DefinePlugin({ // для безопасного использования переменных окружения в коде
      'process.env.ASSET_PATH': JSON.stringify(ASSET_PATH),
    })
  ]
};