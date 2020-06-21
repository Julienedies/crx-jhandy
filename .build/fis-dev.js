/**
 * Created by julien.zhang on 2017/2/6.
 * 本地开发部署
 */

//fis.config.set('project.include', /^\/(?:html|js|css|img)\/.*\.(?:html|js|css|swf|mp4|jpg|png|gif|ico|cur|otf|eot|svg|ttf|woff|woff2)$/i);
//fis.config.set('project.include', /^\/(?:html|js|css|img)\/.*$/img);

//处理sass
/*fis.config.set('modules.parser.scss', 'node-sass');
fis.config.set('modules.parser.sass', 'node-sass');
fis.config.set('roadmap.ext.scss', 'css');
fis.config.set('roadmap.ext.sass', 'css');*/


//静态资源文件域名设置
fis.config.merge({
    roadmap: {
        domain: ''
    }
});

//部署设置
fis.config.set('roadmap.path', [

    //css文件
    {
        reg: /^.+\.(?:css|scss|sass|svg|eot|ttf|woff|woff2)$/i,
        release: 'css/cs/$&',
        url: 'css/cs/$&',
        useDomain: true,
        useSprite: true,
        useHash: true
    },

    //js文件
    {
        reg: '**.js',
        release: 'js/cs/$&',
        url: '/js/cs/$&',
        isJsLike: true,
        useHash: true
    },

    //other
    {
        reg: /.+$/i,
        release: false
    }

]);

//使用fis release --dest local来使用这个配置
fis.config.merge({
    deploy: {
        local: {
            to: '../',
            exclude: /(?:\/(?:demo|example|data|test)\/.+\.(?:html|js|css))|(?:\/_[-_\w\d]+\.html)|(?:\/.+\.md)/i
        }
    }
});