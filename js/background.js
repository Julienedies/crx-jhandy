/**
 * Created by j on 15/6/23.
 */

/*
 * events
 */
const EVENTS = {
    relay: function (request) {
        chrome_tabs.sendMessage(request.url, request);
    },
    tdx_view: function (request) {
        chrome_tabs.sendMessage('http://localhost:3000/*', request);
    },
    active_ftnn: function (request) {
        chrome_tabs.sendMessage('http://localhost:3000/*', request);
    },
    close_tab: function (request) {
        let url = request.url;
        url += '/*';
        url = url.replace('//*', '/*').replace(/^https?/, '*');
        chrome_tabs.remove(url);
    },
    // 接收10jqka页面 content script发过来的消息，同步新浪财经或雪球K线页面
    view_k: function (request) {
        let url = 'http://finance.sina.com.cn/realstock/company/*/nc.shtml';
        url = 'https://xueqiu.com/S/*';
        chrome_tabs.sendMessage(url, request);
    }
};

/*
 * 事件处理器
 */
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {

    console.log(request);

    let events = (request.todo || request.event).split(',');

    events.map((e) => EVENTS[e](request, sender, sendResponse));

});




/*
 * 动态注入js 或 css
 */
function inject(files) {
    files = typeof files == 'string' ? [files] : files;
    (function f(files) {
        var file = files.shift();
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

/*chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {

 if (changeInfo.status === "complete") {

 if (/^http:\/\/basic\.10jqka\.com.cn\/\d{6}\/?$/img.test(tab.url)) {

 inject(['css/cs/10jqka.css', 'js/libs/jquery.min.js', 'js/data/T.js', 'js/cs/10jqka.js']);
 //chrome.tabs.insertCSS(null, {file: 'css/cs/10jqka.css'});
 //chrome.tabs.executeScript(null, {file: 'js/libs/jquery.min.js'}, function(){
 //chrome.tabs.executeScript(null, {file: 'js/data/T.js'});
 //chrome.tabs.executeScript(null, {file: });
 }
 }

 });*/
////////////////////////////////////////////////////////////////////////////////////////////////

var utils = [
    {
        'title': 'ng33',
        "onclick": function (info, tab) {
            //右键菜单响应
            chrome.tabs.getSelected(null, function (tab) {
                chrome.tabs.sendRequest(tab.id, {id: 33}, function (response) {

                });
            });
        }
    },

    {
        'title': 'ng15',
        "onclick": function (info, tab) {
            //右键菜单响应
            chrome.tabs.getSelected(null, function (tab) {
                chrome.tabs.sendRequest(tab.id, {id: 15}, function (response) {

                });
            });
        }
    },

    {
        'title': 'ng30',
        "onclick": function (info, tab) {
            //右键菜单响应
            chrome.tabs.getSelected(null, function (tab) {
                chrome.tabs.sendRequest(tab.id, {id: 30}, function (response) {

                });
            });
        }
    },

    {
        'title': 'ng35',
        "onclick": function (info, tab) {
            //右键菜单响应
            chrome.tabs.getSelected(null, function (tab) {
                chrome.tabs.sendRequest(tab.id, {id: 35}, function (response) {

                });
            });
        }
    },

    /* {
     'title': 'return top',
     "onclick": function (info, tab) {
     function x() {
     console.log('return top');
     document.documentElement.scrollTop = document.body.scrollTop = 0;
     //jQuery('body').animate({'scrollTop':0},400)
     }

     chrome.tabs.executeScript(null, {
     code: '(' + x + ')();'
     });

     }
     },
     */
    /*    {
     'title': 'close window',
     "onclick": function (info, tab) {
     function x() {
     console.log('close window');
     window.close();
     }

     chrome.tabs.executeScript(null, {
     code: '(' + x + ')();'
     });
     }
     },*/

    {
        'title': 'keep active',
        "onclick": function (info, tab) {
            function x() {
                console.log('keep active');
                setInterval(function () {
                    var xhr = new XMLHttpRequest;
                    xhr.open("get", location.href, true);
                    xhr.send(null);
                    console.log(new Date);
                }, 300000);
            }

            console.log(item);
            console.log(info);

            chrome.tabs.executeScript(null, {
                code: '(' + x + ')();'
            });

        }
    }
];

/*var showForPages = ["http://taobao.cjcp.com.cn*//*"];

 for (var i in utils) {

 var item = utils[i];

 var id = chrome.contextMenus.create({
 "title": item.title,
 "onclick": item.onclick,
 "documentUrlPatterns":showForPages
 });

 }*/


chrome.contextMenus && chrome.contextMenus.create({
    title: '使用google搜索：%s', // %s表示选中的文字
    contexts: ['selection'], // 只有当选中文字时才会出现此右键菜单
    onclick: function (params) {
        // 注意不能使用location.href，因为location是属于background的window对象
        chrome.tabs.create({url: 'https://www.google.com/search?q=' + encodeURI(params.selectionText)});
    }
});