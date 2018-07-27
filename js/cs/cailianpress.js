/**
 * Created by j on 18/5/9.
 * 财联社页面有新消息，朗读出来。
 */

console.log('I am cailianpress.js');

$(function () {

    chrome_storage.get('cls.speak', function (result) {

        console.log(result);

        if (result) {

            var timer;
            var speechSU = new window.SpeechSynthesisUtterance();

            var $elm = $("div.contentLeft > div").css({border: 'solid 1px blue'});
            var $child = $elm.find(' > div:eq(1)>div:eq(2) .tele-right-text').css({border: 'solid 1px red'});

            var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

            var observer = new MutationObserver(function (mutations) {

                let m = mutations[0];

                if (/^\d{2}.\d{2}.\d{2}$/.test(m.oldValue)) return;  //时间字符串变化,忽略

                console.log(+new Date, m, m.oldValue, m.wholeText);

                let text = m.wholeText;

                clearTimeout(timer);

                timer = setTimeout(function () {
                    let $child = $elm.find(' > div:eq(1) > div:eq(2) .tele-right-text');
                    console.log(text);
                    speechSU.text = text || $child.text();
                    speechSynthesis.speak(speechSU);
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