/**
 * Created by j on 18/5/9.
 * 财联社页面有新消息，朗读出来。
 */

console.log('I am cailianpress.js');

function notify_2(body, d) {
    var title = "";
    var options = {
        body: body || 'crx-jhandy test.',
        icon: ""
    };

    if (Notification.permission === "granted") {
        var notification = new Notification(title, options);
        notification.onshow = function() {
            setTimeout(function() {
                notification.close();
            }, d || 7000);
        };
    }
    else
    if (Notification.permission !== 'denied') {
        Notification.requestPermission(function (permission) {

        });
    }

}

function notify(msg){
    chrome.runtime.sendMessage({todo: 'notify', title: 'cls', msg: msg});
}


$(function () {

    chrome_storage.get('cls', function (result) {

        console.log(result);

        var timer;
        var speechSU = new window.SpeechSynthesisUtterance();

        var f1 = result.speak && function(text) {
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

});