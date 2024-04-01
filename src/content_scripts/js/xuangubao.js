/**
 *
 * Created by j on 2019-08-13.
 */

import $ from 'jquery';

import utils from '../../js/lib/utils'

console.log('I am xuangubao.js.');

// 如果当前页面是选股宝首页，每分钟刷新一次
if (location.href === 'https://xuangubao.cn/') {
    let d = new Date().getHours();
    if (utils.isTradingTime()) {
        console.log('刷新', +new Date);
        setInterval(() => {
            location.reload();
        }, 90 * 1000);
    }

}

;(() => {
    let div = document.createElement('div');
    div.setAttribute('id', 'clsNewsBox');
    div.style.cssText = `
        z-index:10001;
        position:fixed;
        top:40%;
        left:30%;
        right:30%;
        padding: 2px 8px;
        max-height:5em;
        overflow: hidden;
        background-color:rgba(0,0,0,0.7);
        color:white;
        font-size:18px;
        line-height:22px;
        display: none;
        pointer-events: none;
        -webkit-user-select: none;
        user-select: none;
        cursor: pointer;`;

    setTimeout(() => {
        document.body.appendChild(div);
    }, 1000);

    //---------------------------------------
    let timer;

    chrome.runtime.onMessage.addListener(function (msg) {

        console.info(msg.event, msg);

        let e = msg.event;

        if (e === 'cls_news') {
            clearTimeout(timer);
            // 接收chrome.runtime.sendMessage 或 chrome.tabs.sendMessage 发过来的cls news；
            //div.appendChild(document.createTextNode(msg.msg));
            div.innerText = msg.msg;
            div.style.display = 'box';
            timer = setTimeout( () => {
                div.style.display = 'none';
            }, 36 * 1000);
        }

    });

})();


/*let $loadmore = $('.home-news-footer-loadmore');

utils.onScrollEnd(() => {
    $loadmore.length && $loadmore[0].click();
});*/
