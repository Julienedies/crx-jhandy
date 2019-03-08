/**
 * Created by j on 18/5/9.
 * 财联社页面有新消息，朗读出来。
 */

console.log('I am cailianpress.js');

// 当滚动到页面底部
function on_scroll_end(callback){

    var clientHeight = $(window).height();
    var $doc = $(document);

    $doc.on('scroll', function (e) {
        var scrollTop = $doc.scrollTop();
        console.log(clientHeight , scrollTop, $doc.height());
        if (clientHeight + scrollTop + 70 >= $doc.height()) {
            console.log('滚动到了页面底部');
            callback();
        }
    });
}

function cailianpress() {

    var $more = $("div.contentLeft > div >div:last-child").css({border: 'solid 1px green'});

    on_scroll_end(function(){
        $more[0].click();
    });

    ////////////////////////////////////////////////////////////////////////////////////////////////

    function notify_2(body, d) {
        var title = "";
        var options = {
            body: body || 'crx-jhandy test.',
            icon: ""
        };

        if (Notification.permission === "granted") {
            var notification = new Notification(title, options);
            notification.onshow = function () {
                setTimeout(function () {
                    notification.close();
                }, d || 7000);
            };
        }
        else if (Notification.permission !== 'denied') {
            Notification.requestPermission(function (permission) {

            });
        }

    }

    function notify(msg) {
        chrome.runtime.sendMessage({event:'cls_news', todo: 'relay', url:'http://localhost:3000/*', title: '财经资讯', msg: msg});
    }

    chrome_storage.get('cls', function (result) {

        console.log(result);

        var timer;
        var speechSU = new window.SpeechSynthesisUtterance();

        var f1 = result.speak && function (text) {
                speechSU.text = text;
                speechSynthesis.speak(speechSU);
            };
        var f2 = result.notify && notify;

        if (f1 || f2) {

            var $elm = $("div.contentLeft > div").css({border: 'solid 1px blue'});
            var $child = $elm.find(' > div:eq(1)>div:eq(2) .tele-right-text').css({border: 'solid 1px red'});

            var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

            var observer = new MutationObserver(function (mutations) {

                let m = mutations[0];

                if (/^\d{2}.\d{2}.\d{2}$/.test(m.oldValue)) return;  //时间字符串变化,忽略

                //console.log(+new Date, m, m.oldValue, m.target.nodeValue);

                var text = m.target.nodeValue;

                clearTimeout(timer);

                timer = setTimeout(function () {
                    let $child = $elm.find(' > div:eq(1) > div:eq(2) .tele-right-text');
                    text = text || $child.text();
                    console.log(text, text.replace(/\.txt\s*\{[^{}]*\}\s*$/img, ''));
                    var arr = text.match(/^[【]([^】]+)[】]/);
                    console.info(arr);
                    text = arr ? arr[1] : text;
                    if(text === '点击加载更多') return;
                    f1 && f1(text);
                    f2 && f2(text);
                }, 2000);

            });

            var MutationObserverConfig = {
                //childList: true,
                subtree: true,
                characterData: true,
                characterDataOldValue: true
            };

            observer.observe($elm[0], MutationObserverConfig);

        }
    });

}

function yuncaijing(){

    var $more = $("#newslist >li.loading-list a").css({border: 'solid 1px green'});

    on_scroll_end(function(){
        $more[0].click();
    });

}

// 财联社
if(location.hostname == 'www.cls.cn'){
    $(cailianpress);
}
else
// 云财经
if(location.hostname == 'www.yuncaijing.com'){
    $(yuncaijing);
}



