/*!
 * webpack根据具体项目所做的配置
 * Created by j on 2018-12-31.
 */

const path = require('path')
const glob = require('glob')

const webpack = require('webpack')
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const HtmlPlugin = require('html-webpack-plugin')
const CleanPlugin = require('clean-webpack-plugin')
const ManifestPlugin = require('webpack-manifest-plugin')
const FileManagerPlugin = require('filemanager-webpack-plugin');

//////////////////////////////////////////////////////////////////////////

const utils = require('./utils')

const isPro = process.env.NODE_ENV === 'production'

const config = isPro ? require('./pro') : require('./dev')

// 公共访问路径
const publicPath = config.publicPath
// 项目根目录
const projectRoot = path.resolve(__dirname, '../../')
// 部署目录
const outputPath = path.resolve(__dirname, '../../dist')
// 源代码目录
const srcPath = path.resolve(__dirname, '../../src')

const nodeSassIncludePaths = [path.resolve(__dirname, '../../../')]

/////////////////////////////////// 创建entry ////////////////////////////////////////////////////////
const entry = {
    'options': ['./html/options/main.js'],
    'background': ['./html/background/main.js'],
    'lib/chromeApi': ['./js/lib/chromeApi.js'],
    'lib/utils': ['./js/lib/utils.js']
}
// 生成 content_scripts 入口文件
utils.createEntryForContentScriptsJs(glob.sync(path.join(srcPath, 'content_scripts/js/**.js')) || [], entry);
utils.createEntryForContentScriptsCss(glob.sync(path.join(srcPath, 'content_scripts/css/**.css')) || [], entry);

console.log(111111111111111111)
console.log(entry)

const output = {
    path: outputPath,
    publicPath: publicPath,
    filename: '[name].js',
    chunkFilename: '[name].js',
    sourceMapFilename: '[file].map',
    //libraryTarget: 'umd',
    //globalObject: 'this',
    //libraryExport: 'default',
    //library: '[name]'
}

const plugins = [
    new HtmlPlugin({
        template: 'html/options/index.html',
        filename: 'options.html',
        chunks: ['runtime', 'vendors', 'common', 'options']
    }),
    new HtmlPlugin({
        template: 'html/background/index.html',
        filename: 'background.html',
        chunks: ['runtime', 'vendors', 'common', 'background']
    }),
    new webpack.DefinePlugin({}),
    new webpack.NoEmitOnErrorsPlugin(),
    new VueLoaderPlugin(),
    new CleanPlugin(['dist'], {
        root: projectRoot
    }),
/*    new FileManagerPlugin({
        onEnd: [
            {
                copy: [ { source: './assets/!*', destination: './dist/' }]
            },
            {
                copy: [ { source: './manifest.json', destination: './dist/' }]
            }
        ]
    }),*/
]

let devServer = {}
let cssLoader

const devServerPort = 9083

if (isPro) {

    plugins.push(new MiniCssExtractPlugin({
        filename: "css/[name]_[hash].css",
        chunkFilename: "[name]_[id].css"
    }))

    cssLoader = {
        loader: MiniCssExtractPlugin.loader,
        options: {
            publicPath: publicPath
        }
    }

} else {

    cssLoader = {
        loader: 'style-loader',
        options: {}
    }

    devServer = {
        publicPath: publicPath,
        contentBase: outputPath,
        port: devServerPort,
        writeToDisk: true,
        quiet: false,
        hot: true,
        disableHostCheck: true
    }

    // hmr
/*    Object.entries(entry).forEach(([k, v]) => {
        v = Array.isArray(v) ? v : [v]
        //v.push(`webpack-hot-middleware/client?noInfo=true&reload=true&path=http://localhost:${ devServerPort }/__webpack_hmr`)
        v.unshift(`webpack-dev-server/client?http://localhost:${ devServerPort }/`)
        entry[k] = v
    })
    // webapck-dev-server --hot
    plugins.push(new webpack.HotModuleReplacementPlugin())*/

}


module.exports = {
    mode: config.mode,
    devtool: config.devtool,
    target: 'web',
    projectRoot,
    context: srcPath,
    publicPath,
    devServer,
    entry,
    output,
    plugins,
    cssLoader,
    nodeSassIncludePaths,
    resolve: {
        alias: {
            //basic: path.resolve(__dirname, '../../../basic/'),
            //bulma: path.resolve(context, './vendor/bulma/'),
        },
        extensions: ['.js', '.vue', '.json', '.scss', '.css']
    },
    externals: {
        /*jquery: {
            commonjs: 'jquery',
            commonjs2: 'jquery',
            amd: 'jquery',
            root: '$'
        },
        lodash: {
            commonjs: 'lodash',
            commonjs2: 'lodash',
            amd: 'lodash',
            root: '_'
        },
        moment: {
            commonjs: 'moment',
            commonjs2: 'moment',
            amd: 'moment',
            root: 'moment'
        },
        '@julienedies/brick': {
            commonjs: '@julienedies/brick',
            commonjs2: '@julienedies/brick',
            amd: 'brick',
            root: 'brick'
        },*/
    }
}
