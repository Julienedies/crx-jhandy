/**
 * 修改淘股吧实盘比赛选手实盘纪录个股链接，方便复盘。
 * Created by j on 18/2/11.
 */

import $ from 'jquery';
import utils from '../../js/lib/utils.js'

console.log('I am taoguba.js.');

let w; //新窗口引用。

const isReadInfo = location.pathname === '/readInfo';  // 比赛实盘页面

function view_in_tdx (code) {
    chrome.runtime.sendMessage({todo: 'socket', event: 'view_in_tdx', code: code.replace(/[szh]/img, '')});
}

function view_in_ftnn (code) {
    chrome.runtime.sendMessage({todo: 'socket', event: 'view_in_ftnn', code: code.replace(/[szh]/img, '')});
}

function fix_links () {
    let $th = $(this);
    let str = $th.text();
    //console.log(str);
    let arr = str.match(/[036]\d{5}/img) || []; // $th.text().replace(/(^\s+)|(\s+$)/img, '');
    let code = arr[0];
    if (code) {
        for (let i in STOCK_LIST) {
            if (STOCK_LIST[i][0] === code) {
                console.log(code);
                $th.text(code + '(*)'.replace('*', STOCK_LIST[i][1]));
                isReadInfo && $th.after(`<a href="view_in_ftnn/${ code }">ftnn</a> `);
                return;
            }
        }
    }
}

//将淘股吧里的股票code添加股票名称，方便识别。
setTimeout(function () {
    $('a').each(fix_links);
}, 2400);


$(document.body).on('click', 'a[href^=view_in_]', function (e) {
    let that = e.target;
    let arr = that.href.split('/');
    let code = arr.pop();
    let event = arr.pop();
    console.log(that.href, arr, code, event);
    chrome.runtime.sendMessage({event: event, code: code});
    return false;
}).on('click', 'a[href*="https://www.taoguba.com.cn/quotes/"]', function (e) {
    let that = e.target;
    let code = that.href.match(/\w{2}\d{6}(?!\d)/)[0];
    console.log(code);
    chrome.runtime.sendMessage({event: 'view_in_tdx', code: code.replace(/[szh]/img, '')});
    //return false;
    /*if (!that._href) {
        if (location.host === "127.0.0.1:3300") {
            code = that.href.match(/[^/]{6}(?=\.png)/i)[0];
            code = /^6\d{5}$/.test(code) ? 'sh' + code : 'sz' + code;
        } else {
            code = that.href.match(/\w{2}\d{6}(?!\d)/)[0];
            //chrome.runtime.sendMessage({event: 'tdx_view', code: code.replace(/[szh]*!/img,'')});
        }

        //富途股票页面
        //'https://www.futunn.com/quote/stock?m=sz&code=002898';
        //百度股票页面
        //that._href = 'https://gupiao.baidu.com/stock/sh601989.html'.replace(/[^/]{8}(?=\.html$)/i,code);
        //新浪股票页面
        //that._href = 'http://finance.sina.com.cn/realstock/company/sh600519/nc.shtml'.replace(/[^/]{8}(?=\/nc\.shtml$)/i,code);
        //雪球
        that._href = 'https://xueqiu.com/S/' + code;
    }

    if (w && !w.closed) {
        w.location.href = that._href;
        w.focus();
    } else {
        w = window.open(that._href);
    }

    return false;*/
});


// ------------------------------------- 滚动到页面底部自动加载更多 start --------------------------------------------
// 淘股吧超级动态页面
if (location.href.includes('https://www.taoguba.com.cn/user/getMoreListAction')) {

    let $loadMore = $('#clickLoadmore');

    utils.onScrollEnd( () => {
        $loadMore.click();
    });
}

// --------------------------------------- 滚动到页面底部自动加载更多 end ----------------------------------------
