/**
 * Created by j on 15/6/23.
 */

/*
 * 消息处理器
 * 接收标签页面发来的消息, 处理
 */
const EVENTS = {
    relay: function (request) {
        chrome_tabs.sendMessage(request.url, request);
    },
    only_self: function (request) {
        chrome_tabs.sendMessage('http://basic.10jqka.com.cn/*', request);
    },
    tdx_view: function (request) {
        chrome_tabs.sendMessage('http://localhost:3000/*', request);
    },
    active_ftnn: function (request) {
        chrome_tabs.sendMessage('http://localhost:3000/*', request);
    },
    close_tab: function (request) {
        let url = request.url;
        let arr = Array.isArray(url) ? url : [url];
        arr.map(function (url) {
            url += '/*';
            url = url.replace('//*', '/*').replace(/^https?/, '*');
            chrome_tabs.remove(url);
        });
    },
    // 接收10jqka页面 content script发过来的消息，同步新浪财经或雪球K线页面
    view_k: function (request) {
        let url = 'http://finance.sina.com.cn/realstock/company/*/nc.shtml';
        url = 'https://xueqiu.com/S/*';
        chrome_tabs.sendMessage(url, request);
    },
    notify: function(request){
        console.info(request);
        var opt = {
            type: 'basic',
            title: request.title || '',
            message: request.msg || 'hello world.',
            iconUrl: 'img/icon-bitty.png'
        };
        chrome.notifications.create('', opt, function(id){
            setTimeout(function(){
                chrome.notifications.clear(id, function(){});
            }, 7000);
        });
    },
    download: function (request) {
        let urls = Array.isArray(request.url) ? request.url : [request.url];
        let folder = request.folder.replace(/[|\\-\\/:*?"'<>=%$@#+-;,!\^]/g, "_");
        urls.map((url) => {
            let filename = url.match(/[^/]+\.(jpg|png)$/)[0];
            filename = `${folder}/${filename}`;
            let options = {
                url: url,
                filename: filename
            };
            console.log(options);
            chrome.downloads.download(options, function (result) {
                console.log(result);
            });
        });

    }
};

/*
 * onMessage 事件处理器
 */
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {

    console.log(request);

    let events = (request.todo || request.event).split(',');

    events.map((e) => EVENTS[e](request, sender, sendResponse));

});




/*chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {

 if (changeInfo.status === "complete") {

 if (/^http:\/\/basic\.10jqka\.com.cn\/\d{6}\/?$/img.test(tab.url)) {

 chrome_tabs.inject(['css/cs/10jqka.css', 'js/libs/jquery.min.js', 'js/data/T.js', 'js/cs/10jqka.js']);
 //chrome.tabs.insertCSS(null, {file: 'css/cs/10jqka.css'});
 //chrome.tabs.executeScript(null, {file: 'js/libs/jquery.min.js'}, function(){
 //chrome.tabs.executeScript(null, {file: 'js/data/T.js'});
 //chrome.tabs.executeScript(null, {file: });
 }
 }

 });*/


