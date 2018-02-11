/**
 * Created by j on 18/1/20.
 */

/**
 *  content_script.js检查之前是否有使用过的文本选择符，
 *  如果有则根据选择符选择文本传回给popup页面。
 *  如果没有旧选择符，则等待popup页面传入文本选择符，存储该选择符，并依据选择符选择文本传回给popup页面。
 *
 */
//chrome.downloads.download({url:location.href,filename:'test.txt'}, function(){});

function $(selector) {
    return selector ? document.querySelector(selector) : document.querySelector('body');
}

var domain = location.hostname;

var domainSelector = '';

chrome.storage.sync.get(domain, function (date) {
    domainSelector = date[domain];
    console.log(JSON.stringify(date));
});


function setSelector(selector) {
    var dobj = {};

    if (selector) {
        dobj[domain] = selector;
        chrome.storage.sync.set(dobj, function () {
            console.log("保存完毕");
        });
    }

    return selector;
}


// 添加监听器，接收popup窗口传过来的数据
chrome.extension.onRequest.addListener(
    function (request, sender, sendResponse) {

        console.log(sender.tab ?
        "from a content script:" + sender.tab.url :
            "from the extension");

        var dobj;
        var content;
        var selector = request.selector;
        var url = location.href;
        var filename = $('title').innerText;

        selector = selector ? setSelector(selector) : domainSelector;
        content = $(selector) && $(selector).innerText;

        dobj = {url: url, filename: filename, content: content};

        //sendResponse && sendResponse(dobj);

        //传递选择的文本数据给popup.html
        chrome.extension.sendRequest(dobj, function (response) {
            console.log(response);
        });

    }
);

