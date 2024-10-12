/**
 * 财联社页面有新消息，朗读出来。
 * Created by j on 18/5/9.
 */

import $ from 'jquery';
import { chrome_storage, chrome_tabs } from '../../js/lib/chromeApi';
import utils from '../../js/lib/utils.js';

console.log('I am cailianpress.js 1');

const shandyHost = 'http://127.0.0.1:3300';

// 财联社
function cailianpress () {

    // 滚动到底，自动显示
    let $more = $("div.content-main-box .content-left .list-more-button.more-button").css({border: 'solid 2px red'});

    utils.onScrollEnd(function () {
        console.log('onScrollEnd');
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

    ////////////////////////////////////////////////////////////////////////////////////////////////

    function notify (msg) {
        // 传递消息给monitor页面，在monitor页面可以通过socket传给服务器，服务器再通过socket广播给 IPad；
        console.log('广播新消息=> ', msg);
        $.ajax({
            url: `${ shandyHost }/cls_news`,
            type: 'post',
            data: {msg: `${ msg }`}
        }).done(function (msg) {
            chrome.runtime.sendMessage({todo: 'notify', duration: 4, title: '', msg: '财联社新消息广播 OK!'});
        }).fail(function (err) {
                console.error(err);
                //alert('财联社新消息广播失败.');
            }
        );
        chrome.runtime.sendMessage({event: 'cls_news', todo: 'relay', url: 'http://localhost:3300/*', title: '财经资讯', msg: msg});
        //chrome.runtime.sendMessage({event: 'cls_news', todo: 'relay', url: 'http://192.168.3.2:3300/*', title: '财经资讯', msg: msg});
        //chrome.runtime.sendMessage({event: 'cls_news', todo: 'relay', url: 'https://xuangubao.cn', title: '财经资讯', msg: msg});
        console.log('广播新消息 end=> ');
    }

    // 从检查默认配置开始，在回调函数里开启主程序
    chrome_storage.get('cls', function (result) {

        console.log(result);

        let timer;
        let speechSU = new window.SpeechSynthesisUtterance();

        // 回调函数，语音播报新财经消息；
        let callback1 = result.speak && function (text) {
            // 检测是不是交易时间
            let reg1 = /【[\s\S]+】/im;
            let reg2 = /[，。].+$/im;
            let str = text.slice(8, 48).replace(/财联社\d+月\d+日电/, '');
            let str2 = str.slice(0, 24);
            let arr = str.match(reg1) || [];
            if (arr[0]) {
                str = arr[0];
                str2 = str;
            } else {
                str = str.replace(reg2, '');
                str2 = str2.replace(reg2, '');
            }

            console.log(str, str.length);
            speechSU.text = `${ str } ;; ${ str2 }`;
            speechSynthesis.speak(speechSU);
        };

        // 回调函数，传递新财经消息；
        let callback2 = result.notify && notify;

        if (callback1 || callback2) {

            // 显示红色边框和蓝色边框，测试页面dom结构没有改变
            let $elm = $("div.content-left .telegraph-content-left +div").css({border: 'solid 1px red'});
            let selector = '.telegraph-list:first-child .telegraph-content-box';
            let $child = $elm.find(selector).css({border: 'solid 1px blue'});

            setTimeout(function () {
                //$elm.css({border: 'none'});
                $child.css({border: 'none'});
            }, 9 * 1000);

            let oldText = '';

            let MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

            let observer = new MutationObserver(function (mutations) {

                //console.table(mutations);
                let m = mutations[0];

                if (/^\d{2}.\d{2}.\d{2}$/.test(m.oldValue)) return;  //时间字符串变化,忽略

                console.info(+new Date, m, m.oldValue, m.target.nodeValue);

                let text = m.target.nodeValue;

                if (text && text.length < 10) return;

                clearTimeout(timer);

                timer = setTimeout(function () {
                    let $child = $elm.find(selector);
                    text = text || $child.text();
                    console.log(text, text.replace(/\.txt\s*\{[^{}]*\}\s*$/img, ''));
                    let arr = text.match(/^[【]([^】]+)[】]/);
                    console.info(arr);
                    //text = arr ? arr[1] : text;
                    if (text === oldText) return;
                    if (text === '点击加载更多') return;
                    oldText = text;

                    // 只在交易时间进行消息提示和语言播报；
                    if (utils.isTradingTime()) {
                        callback1 && callback1(text);
                        callback2 && callback2(text);
                    }
                }, 2000);

            });


            let MutationObserverConfig = {
                childList: true,
                subtree: true,
                //characterData: true,
                characterDataOldValue: true
            };

            // 监控dom变化，检测新财经消息
            observer.observe($elm[0], MutationObserverConfig);

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
}
// 财联社主题页面
else if (location.href.includes('https://www.cls.cn/subject/')) {

    let $more = $("div.content-main-box .content-left .list-more-button.more-button").css({border: 'solid 2px red'});

    utils.onScrollEnd(function () {
        console.log('onScrollEnd');
        $more[0].click();
    });
}
// 云财经
else if (location.hostname === 'www.yuncaijing.com') {
    $(yuncaijing);
}






