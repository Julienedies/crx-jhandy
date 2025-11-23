/**
 * Created by j on 25/11/22.
 */

//import _ from 'https://cdn.jsdelivr.net/npm/lodash-es@4.17.21/lodash.min.js';
//import { chrome_tabs } from './chromeApi.js'

const chrome_tabs = {

    query: function (url, callback) {
        let _url = url;
        let pattern = url.indexOf('*') > -1;
        if (!pattern) {
            _url = url.replace(/https?:\/\/([^/]+).*/, '*//$1/*');
        }
        console.log(url, ' --------- ', _url);
        chrome.tabs.query({url: _url}, function (tabs) {
            tabs = tabs.filter(tab => {
                console.info('tab =>', tab);
                return pattern || tab.url.indexOf(url) > -1;
            });
            callback(tabs);
        });

    },
    reload: function (url, callback) {
        this.query(url, function (tabs) {
            tabs.map(function (tab) {
                chrome.tabs.reload(tab.id, callback);
            });
        });
    },
    remove: function (url) {
        this.query(url, function (tabs) {
            tabs = tabs.map(function (tab) {
                return tab.id;
            });
            chrome.tabs.remove(tabs);
        });
    },
    sendMessage: function (url, request) {
        this.query(url, function (tabs) {
            tabs.map(function (tab) {
                chrome.tabs.sendMessage(tab.id, request);
            })
        });
    },
    /*
     * 动态注入js 或 css
     * @param files {Array} ['css/cs/10jqka.css', 'js/libs/jquery.min.js', 'js/data/T.js', 'js/cs/10jqka.js']
     */
    inject: function (files) {
        files = typeof files == 'string' ? [files] : files;
        (function f (files) {
            let file = files.shift();
            if (file) {
                if (/\S+\.css$/.test(file)) {
                    chrome.tabs.insertCSS(null, {file: file}, function () {
                        f(files);
                    });
                } else {
                    chrome.tabs.executeScript(null, {file: file}, function () {
                        f(files);
                    });
                }
            }
        })(files);
    }
};


// 简单的 POST 请求
async function postData(url, data) {
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        
        console.log('fetch Success:', result);
        
        return result;
        
    } catch (error) {
        console.error('Fetch error:', error);
        throw error;
    }
}

// 使用示例
// postData('https://api.example.com/data', { key: 'value' })
//     .then(data => console.log('Response:', data))
//     .catch(error => console.error('Error:', error));


//import { chrome_tabs } from './chromeApi'

//import './contextMenus'
//import './webRequest'


const shandyHost = 'http://127.0.0.1:3300';

const _global = {
    code: ''
};

console.log('<<<<<<<<<<<<<<<<<<<<<<<<<<<<   I am background.js');

/*
 * 消息处理器
 * 接收标签页面发来的消息, 处理
 */
const ACTIONS = {
    
    mark_stock_logic: function(req, sender, sendResponse) {
        postData(`${shandyHost}/stock/logic`, req.data)
        .then(data => sendResponse({msg: 'logic 标记 ok'}))
        .catch(error => console.error('Error:', error));
    },
    
     mark_news: function(req, sender, sendResponse) {
        postData(`${shandyHost}/stock/news`, req.data)
        .then(data => sendResponse({msg: 'news 标记 ok'}))
        .catch(error => console.error('Error:', error));
    },
    
    mark_note: function(req, sender, sendResponse) {
        postData(`${shandyHost}/note`, req.data)
        .then(data => sendResponse({msg: 'note 标记 ok'}))
        .catch(error => console.error('Error:', error));
    },
    
    mark_note2: function(req, sender, sendResponse) {
        postData(`${shandyHost}/note2`, req.data)
        .then(data => sendResponse({msg: 'note 标记 ok'}))
        .catch(error => console.error('Error:', error));
    },   
    
    // 把新财经消息post 到shandy
    cls_news: function(req, sender, sendResponse) {
         postData(`${shandyHost}/cls_news`, req.data)
        .then(data => sendResponse({msg: ' new cls_news'}))
        .catch(error => console.error('Error:', error));
    },
    
    // 转发消息给某标签页
    relay: function (req) {
        chrome_tabs.sendMessage(req.url || `${ shandyHost }/*`, req, function (res) {
            console.log(res);
        });
        if (req.event === 'open_by_jhandy' && req.code) {
            _global.code = req.code;
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
            iconUrl: '/assets/img/icon-small.png'
        };
        chrome.notifications.create(undefined, opt, function (id) {
            setTimeout(function () {
                chrome.notifications.clear(id, function () {
                });
            }, (request.duration || 4) * 1000);
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

    console.info('onMessage Listener => ',request.todo || request.event, request);

    let events = (request.todo || request.event).split(',');

    events.map((e) => ACTIONS[e](request, sender, sendResponse));
    
    return true;

});

//console.log('Icon URL:', chrome.runtime.getURL('assets/img/icon-bitty.png'));
// === 测试：5秒后强制弹通知 ===
// setTimeout(() => {
//   console.log('🕒 Triggering test notification...');
//   chrome.notifications.create({
//     type: 'basic',
//     title: '【测试】Background 通知',
//     message: '如果你看到这条，说明 notifications API 正常工作！',
//     iconUrl: '/assets/img/icon-small.png'
//   }, (id) => {
//     console.log('Test notification ID:', id);
//     if (chrome.runtime.lastError) {
//       console.error('Test notification error:', chrome.runtime.lastError);
//     }
//   });
// }, 5000);


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


