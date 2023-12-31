/**
 * Created by j on 15/6/23.
 */

import { chrome_storage, chrome_tabs } from '../../js/lib/chromeApi';

import './contextMenus'
import './webRequest'


const shandyHost = 'http://localhost:3300';

const _global = {
    code: ''
};
/*
 * 消息处理器
 * 接收标签页面发来的消息, 处理
 */
const EVENTS = {

    relay: function (req) {
        chrome_tabs.sendMessage(req.url || `${ shandyHost }/*`, req, function (res) {
            console.log(response);
        });
        if (req.event === 'open_by_jhandy' && req.code) {
            _global.code = req.code;
            console.log(_global);
        }
    },

    socket: function (req) {
        chrome_tabs.sendMessage(`${ shandyHost }/*`, req);
    },

    view_in_tdx: function (request) {
        chrome_tabs.sendMessage(`${ shandyHost }/*`, request);
    },
    view_in_ftnn: function (request) {
        chrome_tabs.sendMessage(`${ shandyHost }/*`, request);
    },

    active_ftnn: function (request) {
        chrome_tabs.sendMessage(`${ shandyHost }/*`, request);
    },

    close_tab: function (request) {
        let url = request.url;
        let arr = Array.isArray(url) ? url : [url];
        let delay = request.delay || 0;
        setTimeout(function () {
            arr.map(function (url) {
                url = url.replace(/\?.*/i, '');
                url += '/*';
                url = url.replace('//*', '/*').replace(/^https?/, '*');
                chrome_tabs.remove(url);
            });
        }, delay * 1000 || 10);
    },

    // 接收10jqka页面 content script发过来的消息，同步新浪财经或雪球K线页面
    view_k: function (request) {
        let url = 'http://finance.sina.com.cn/realstock/company/*/nc.shtml';
        url = 'https://xueqiu.com/S/*';
        chrome_tabs.sendMessage(url, request);
    },

    notify: function (request) {
        console.info(request);
        let opt = {
            type: 'basic',
            title: request.title || '',
            message: request.msg || 'hello world.',
            iconUrl: '/assets/img/icon-bitty.png'
        };
        chrome.notifications.create('', opt, function (id) {
            setTimeout(function () {
                chrome.notifications.clear(id, function () {
                });
            }, (request.duration || 7) * 1000);
        });
    },

    get_global: function (request, sender, sendResponse) {
        sendResponse(_global);
    },

    download: function (request) {
        let urls = Array.isArray(request.url) ? request.url : [request.url];
        let folder = request.folder.replace(/[|\\-\\/:*?"'<>=%$@#+-;,!^]/g, "_");
        folder = folder.replace(/\s+/img, '');

        let delay = 500;

        if (urls.length > 20) {
            delay = 1000;
        }
        if (urls.length > 30) {
            delay = 2000;
        }

        urls.forEach((url, index) => {

            setTimeout(function () {
                let filename = url.match(/[^/]+\.\w+$/)[0];
                filename = `${ folder }/${ filename }`;
                let options = {
                    url: url,
                    filename: filename
                };
                console.log(options);
                chrome.downloads.download(options, function (result) {
                    console.log(result);
                });
            }, index * delay);

        });

    }
};

/*
 * onMessage 事件处理器
 */
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {

    console.info(request.todo || request.event, request);

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


