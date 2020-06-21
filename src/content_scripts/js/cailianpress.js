/**
 * 财联社页面有新消息，朗读出来。
 * Created by j on 18/5/9.
 */

import $ from 'jquery';
import { chrome_storage, chrome_tabs } from '../../js/lib/chromeApi';
import utils from '../../js/lib/utils.js';

console.log('I am cailianpress.js 1');

// 财联社
function cailianpress () {

    let $more = $("div.content-main-box .content-left .list-more-button.more-button").css({border: 'solid 2px red'});

    utils.onScrollEnd(function () {
        $more[0].click();
    });

    ////////////////////////////////////////////////////////////////////////////////////////////////

    function notify_2 (body, d) {
        let title = "";
        let options = {
            body: body || 'crx-jhandy test.',
            icon: ""
        };

        if (Notification.permission === "granted") {
            let notification = new Notification(title, options);
            notification.onshow = function () {
                setTimeout(function () {
                    notification.close();
                }, d || 7000);
            };
        } else if (Notification.permission !== 'denied') {
            Notification.requestPermission(function (permission) {

            });
        }

    }

    function notify (msg) {
        chrome.runtime.sendMessage({event: 'cls_news', todo: 'relay', url: 'http://localhost:3300/*', title: '财经资讯', msg: msg});
    }

    chrome_storage.get('cls', function (result) {

        console.log(result);

        let timer;
        let speechSU = new window.SpeechSynthesisUtterance();

        let f1 = result.speak && function (text) {
            speechSU.text = text;
            speechSynthesis.speak(speechSU);
        };
        let f2 = result.notify && notify;

        if (f1 || f2) {

            let $elm = $("div.content-left").css({border: 'solid 1px blue'});
            let selector = '>div .telegraph-list:first-child .telegraph-content-box';
            let $child = $elm.find(selector).css({border: 'solid 1px red'});

            setTimeout( function (){
                $elm.css({border:'none'});
                $child.css({border:'none'});
            }, 5 * 1000);

            let oldText = '';

            let MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

            let observer = new MutationObserver(function (mutations) {

                console.table(mutations);
                let m = mutations[0];

                if (/^\d{2}.\d{2}.\d{2}$/.test(m.oldValue)) return;  //时间字符串变化,忽略

                console.info(+new Date, m, m.oldValue, m.target.nodeValue);

                let text = m.target.nodeValue;

                clearTimeout(timer);

                timer = setTimeout(function () {
                    let $child = $elm.find(selector);
                    text = text || $child.text();
                    console.log(text, text.replace(/\.txt\s*\{[^{}]*\}\s*$/img, ''));
                    let arr = text.match(/^[【]([^】]+)[】]/);
                    console.info(arr);
                    //text = arr ? arr[1] : text;
                    if(text === oldText) return;
                    if (text === '点击加载更多') return;
                    oldText = text;
                    f1 && f1(text);
                    f2 && f2(text);
                }, 2000);

            });

            let MutationObserverConfig = {
                childList: true,
                subtree: true,
                //characterData: true,
                characterDataOldValue: true
            };

            observer.observe(document.body, MutationObserverConfig);

        }
    });

}

// 云财经页面
function yuncaijing () {

    let $more = $("#newslist >li.loading-list a").css({border: 'solid 1px green'});

    utils.onScrollEnd(function () {
        $more[0].click();
    });

}


// 财联社首页
if (location.hostname === 'www.cls.cn' && location.pathname === '/telegraph') {
    $(cailianpress);
} else
// 云财经
if (location.hostname === 'www.yuncaijing.com') {
    $(yuncaijing);
}



