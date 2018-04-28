/**
 *
 * 同花顺个股页面自动切换时，用于关掉个股站点窗口
 */

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {

    var url = request.close_url;
    if (request.id == '10jqka' && url) {
        url += '/*';
        url = url.replace('//*', '/*');

        chrome.tabs.query({url: url}, function (tabs) {
            console.log(tabs);
            var tab = tabs[0];
            tab && chrome.tabs.remove(tab.id, function () {
            })
        });

    }

});


/**
 *
 * 接收10jqka页面 content script发过来的消息，同步新浪财经或雪球K线页面
 */

chrome.runtime.onMessage.addListener(function for_10jqka(request, sender, sendResponse) {
    var code = request.code;
    var k_url;
    k_url = 'http://finance.sina.com.cn/realstock/company/*/nc.shtml';
    k_url = 'https://xueqiu.com/S/*';
    if (request.id == '10jqka' && code) {
        chrome.tabs.query({url: k_url}, function (tabs) {
            var tab = tabs[0];
            tab && chrome.tabs.sendMessage(tab.id, {
                code: code,
                greeting: "Can you hear me?"
            }, function (response) {
            });
        });
    }
});


/**
 *
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


