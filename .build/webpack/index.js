/*!
 * webpack 项目通用基础配置;  混入 config,  prod or dev
 * Created by j on 2018-12-24.
 */

console.log(process.env.NODE_ENV)

const config = require('./config')

module.exports = {
    mode: config.mode,  // 会设置打包文件环境下的 process.env.NODE_ENV
    devtool: config.devtool,
    context: config.context,  // 基础目录，绝对路径，用于从配置中解析入口起点(entry point)和 loader
    entry: config.entry,
    output: config.output,
    resolve: config.resolve,
    externals: config.externals,
    devServer: config.devServer,
    plugins: config.plugins,
    module: {
        rules: [
            {
                test: /\.vue$/,
                use: {
                    loader: 'vue-loader',
                    options: {}
                }
            },
/*            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                enforce: "pre",
                use: {
                    loader: 'eslint-loader',
                    options: {}
                }
            },*/
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: [
                    {
                        loader: 'babel-loader',
                        /*  配置见 .babelrc
                        options: {
                            presets: ['@babel/preset-env'],
                            plugins: ['@babel/plugin-syntax-dynamic-import']
                        }*/
                    }
                ]
            },
            {
                test: /\.html$/,
                use: [{
                    loader: 'html-loader',
                    options: {
                        interpolate: true,
                        attrs: ['img:src', 'img:data-src', 'audio:src', 'link:href']
                    }
                },
                ]
            },
            {
                test: /\.(png|jpg|gif)$/,
                use: [
                    {
                        loader: "file-loader",
                        options: {
                            name: '[hash].[ext]',
                            outputPath: './img',
                            publicPath: config.publicPath + 'img/'
                        }
                    }
                ]
            },
            {
                test: /\.(svg|woff2?|eot|ttf)$/,
                use: [
                    {
                        loader: "file-loader",
                        options: {
                            name: '[name].[ext]',
                            outputPath: './font',
                            publicPath: config.publicPath + 'font/'
                        }
                    }
                ]
            },
            {
                test: /\.(sa|sc|c)ss$/,
                exclude: /node_modules/,
                use: [
                    //cssLoader,
                    {
                        loader: "file-loader",
                        options: {
                            name: '[path][name].css',
                            outputPath: '',
                            publicPath: config.publicPath
                        }
                    },
                    {loader: "extract-loader"},
                    {
                        loader: 'css-loader',
                        options: {
                            url: true,
                        }
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            includePaths: config.nodeSassIncludePaths || ['']
                        }
                    }
                ]
            },
            {
                test: /node_modules\/.*\.(sa|sc|c)ss$/,
                use: [
                    config.cssLoader,
                    {
                        loader: 'css-loader',
                        options: {}
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            includePaths: config.nodeSassIncludePaths || ['']
                        }
                    }
                ]
            }
        ]
    },
    optimization: {
        runtimeChunk: 'single',
        splitChunks: {
            chunks: 'all',  // async initial all
            minSize: 3000,  // 3k  chunk最小30k以上, 才会分离提取
            minChunks: 1,    // 最少有两次重复引用, 才会分离提取
            maxAsyncRequests: 15,
            maxInitialRequests: 15,
            automaticNameDelimiter: '~',
            name: 'common',
            cacheGroups: {
/*                styles: {
                    name: 'styles',
                    test: /\.css$/,
                    chunks: 'all',
                    enforce: true,
                    priority: 20,
                },*/
                vendors: {
                    name: 'vendors',
                    test: /[\\/]node_modules[\\/]/,
                    chunks: 'all',
                    minChunks: 1,
                    minSize: 3000,
                    priority: 100
                },
                common: {
                    name: 'all',
                    test: /\.zzz/,
                    minChunks: 2,
                    chunks: 'async',
                    priority: 10,
                    minSize: 30000,
                    reuseExistingChunk: true // 表示是否使用已有的 chunk，如果为 true 则表示如果当前的 chunk 包含的模块已经被抽取出去了，那么将不会重新生成新的。
                }
            }
        }
    }
}
