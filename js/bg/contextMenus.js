/**
 * Created by j on 18/8/4.
 * 右键菜单
 * [["-1","Bing","http://www.bing.com/search?q=TESTSEARCH",true],["-1","google","https://www.google.com/search?q=TESTSEARCH",true],["-1","搜狗","https://www.sogou.com/web?query=TESTSEARCH&_asf=www.sogou.com&_ast=&w=01019900&p=40040100&ie=utf8&from=index-nologin&s_from=index&sut=1262&sst0=1520757412083&lkt=0%2C0%2C0&sugsuv=1520754518690289&sugt",true],["-1","百度","https://www.baidu.com/s?ie=utf-8&f=8&rsv_bp=0&rsv_idx=1&tn=baidu&wd=TESTSEARCH&rsv_pq=f27231940000b5aa&rsv_t=6976ukM98Y7xn12n8PMdk9dZtV98G5kKwmPaz28F3freOP8BqO4hGUhUwcc&rqlang=cn&rsv_enter=1&rsv_sug3=6&rsv_sug1=5&rsv_sug7=100&rsv_sug2=0&inputT=2110&rsv_sug4=3410",true],["-1","A股","https://www.baidu.com/s?ie=UTF-8&wd=A%E8%82%A1%20TESTSEARCH",true],["-1","维基","https://zh.wikipedia.org/wiki/TESTSEARCH",true],["-1","youdao","http://dict.youdao.com/w/eng/TESTSEARCH",true],["-1","fanyi","http://fanyi.baidu.com/#en/zh/TESTSEARCH",true],["-1","translate","https://translate.google.cn/?hl=zh-CN#en/zh-CN/TESTSEARCH",true],["-1","豆瓣","https://www.douban.com/search?q=TESTSEARCH",true],["-1","虾米","http://www.xiami.com/search?key=TESTSEARCH&pos=1",true],["-1","知乎","https://www.zhihu.com/search?type=content&q=TESTSEARCH",true],["-1","BT","http://www.btbtdy.com/search/TESTSEARCH.html",true],["-1","Bing Images","http://www.bing.com/images/search?q=TESTSEARCH",false],["-1","IMDB","http://www.imdb.com/find?s=all&q=TESTSEARCH",false],["-1","Wikipedia","http://en.wikipedia.org/wiki/Special:Search?search=TESTSEARCH&go=Go",false],["-1","Google Images","http://www.google.com/images?q=TESTSEARCH",false]]
 */

//
/*chrome.contextMenus.create({
    title: '使用google搜索：%s', // %s表示选中的文字
    contexts: ['selection'], // 只有当选中文字时才会出现此右键菜单
    onclick: function (params) {
        // 注意不能使用location.href，因为location是属于background的window对象
        chrome.tabs.create({url: 'https://www.google.com/search?q=' + encodeURI(params.selectionText)});
    }
});*/

//
chrome.contextMenus.create({
    title: '同花顺问财：%s', // %s表示选中的文字
    contexts: ['selection'], // 只有当选中文字时才会出现此右键菜单
    onclick: function (params) {
        // 注意不能使用location.href，因为location是属于background的window对象
        chrome.tabs.create({url: `https://www.iwencai.com/data-robot/extract-new?qs=pc_~soniu~others~resultpage~datarobot~input&w=${encodeURI(params.selectionText)}&querytype=stock&dataSource=send_click`});
    }
});