/**
 * Created by j on 18/3/9.
 * 1.修改同花顺个股资料页面样式，鼠标滚动切换个股
 * 2.同步新浪或雪球个股页面K线显示
 */

import $ from 'jquery';
import { chrome_storage, chrome_tabs } from '../../js/lib/chromeApi';

console.log('I am 10jqka.js.');


let STOCKS = window.STOCKS || [];  // 主要用于股票列表自动切换功能

let openByShandy = location.search.match(/\?self[=][1]/);

let reg = /\/(\d{6})\//;
let currentCode = location.href.match(reg)[1];


// 同一时刻只保持一个被jhandy打开的页面
if (openByShandy) {
    STOCKS = [];
    chrome.runtime.sendMessage({todo:'relay', event: 'open_by_jhandy', code: currentCode, url: 'http://basic.10jqka.com.cn/*'});
}

chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse){
    console.log('是否关闭前标签页', msg.event, msg.code, currentCode);
    if(msg.event === 'open_by_jhandy' && msg.code !== currentCode){
        chrome.runtime.sendMessage({
            event: 'close_tab',
            code: currentCode,
            url: [location.href.replace('company.html?self=1', ''), urlMap.ycj]
        });
    }
});


let stocks = STOCKS.map(function (x) {
        return x[0];
    }) || [];

let index = stocks.indexOf(currentCode);
let prev = stocks[index - 1] || stocks[stocks.length - 1];
let next = stocks[index + 1] || stocks[0];

let stockPrefix = /^6/.test(currentCode) ? 'sh' : 'sz';
let prefixCode = stockPrefix + currentCode;

let name = document.title.match(/\S+(?=.\d{6})/img);
let wd = `${name?name[0]:currentCode}`;

let urlMap = {
    ycj: 'http://www.yuncaijing.com/quote/*.html'.replace('*', prefixCode),
    xueqiu: 'https://xueqiu.com/S/*'.replace('*', prefixCode),
    ths_p: 'http://basic.10jqka.com.cn/*/company.html'.replace('*', currentCode),
    ths_new: 'http://basic.10jqka.com.cn/*/'.replace('*', currentCode),
    ths_c: 'http://basic.10jqka.com.cn/*/concept.html'.replace('*', currentCode),
    ths_news: 'http://basic.10jqka.com.cn/*/news.html'.replace('*', currentCode),
    wencai:'https://www.iwencai.com/data-robot/extract-new?qs=pc_~soniu~others~resultpage~datarobot~input&w=*&querytype=stock&dataSource=send_click'.replace('*', currentCode),
    xuangubao: `https://xuangubao.cn/stock/${currentCode}.${ stockPrefix.toLocaleUpperCase().replace('SH','SS') }`,
    taoguba: `https://www.taoguba.com.cn/quotes/${prefixCode}`,
    site: ''
};


let html = `<a href="${ urlMap.ycj }" target="_blank">云财经</a>
            <a href="${ urlMap.xuangubao }" target="_blank">选股宝</a>
            <a href="${ urlMap.taoguba }" target="_blank">淘股吧</a>
            <a href="${ urlMap.xueqiu }" target="_blank">雪球</a>
            <a href="https://www.jiuyangongshe.com/search/563ed50d65d645219329a3c9b45289e7?type=1&k=${ encodeURIComponent(wd) }", target="_blank">韭研</a>
            <a href="https://www.baidu.com/s?ie=utf-8&f=8&rsv_bp=1rsv_idx=1&tn=baidu&wd=${ encodeURIComponent(wd + ' A股') }", target="_blank">百度</a>
            <a href="http://localhost:2018/public/static/html/stock/c/index.html?code=${ currentCode }&edit=1", target="_blank">自定义</a>`;


let $body = $(document.body);

function getNameByCode(code) {
    let item = STOCKS.filter(function (item) {
        return item && item[0] === code;
    });
    return item[0] && item[0][1];
}

function closeTab(){
    chrome.runtime.sendMessage({
        todo: 'close_tab,active_ftnn',
        event: 'active_ftnn',
        url: location.href.replace('company.html?self=1', '')
    });
}

function activeFtnn(){
    chrome.runtime.sendMessage({
        todo: 'active_ftnn',
        event: 'active_ftnn'
    });
}

let goToNext = function (code) {
    console.log('goto:', code);
    if (code) {
        location.href = location.href.replace(reg, '/' + code + '/');
    }
};

let callback = function (e) {
    //正负值表示滚动方向
    let isUp = e && e.originalEvent.deltaY < 0;
    goToNext(isUp ? prev : next);
};

let createNav = function () {
    let $c = $('<div style="position:fixed;bottom:40%;right:0;background: rgba(0,0,0,0.6);color:white;z-index:10000;line-height: 2.8;width:5em;text-align: center;cursor: pointer; font-size: 1.3em;"></div>').appendTo($body);
    let $prev = $('<div>  *</div>'.replace('*', getNameByCode(prev))).appendTo($c).on('click', function () {
        goToNext(prev);
    });
    let $next = $('<div>  *</div>'.replace('*', getNameByCode(next))).appendTo($c).on('click', function () {
        goToNext(next);
    });
};

let createLinks = function () {

    //$url = $('iframe').contents().find('#detail a').eq(0);
    let $td = $('#detail table:first td:last');
    let site_url = $td.find('a:first').attr('href');
    urlMap.site =  site_url && site_url + '?close=400';
    $td.append(`<div>${html}</div>`);
};

let createIframe = function () {
    let href = location.href;
    let url = /company.html$/.test(href) ? href.replace('company.html', '') : href + 'company.html';
    $body.append('<iframe src="*"></iframe>'.replace('*', url));
};

let titleTimer = function (interval, amount) {
    let $title = $('title');
    let title = $title.text();
    let count = Math.floor(interval * amount);
    let timer = setInterval(function () {
        count -= 1;
        count < 1 && clearInterval(timer);
        $title.text(count + ' # ' + title);
    }, 1000);
};

/**
 * @param arr Array  => [{url:'', duration: 30}] 要访问的站点队列
 * @param callback Function
 **/
function g(arr, callback) {
    let win;
    let url;
    let item = arr.shift();
    if (item && item.url) {
        url = item.url;
        win = window.open(url);
        setTimeout(function () {
            if (url.search(location.host) > -1) {
                win.close();
            } else {
                chrome.runtime.sendMessage({todo: 'close_tab', url: url});
            }
            g(arr, callback);
        }, item.duration * 1000);
    } else {
        callback();
    }
}

//发送消息给background.js，通过background.js同步个股K线页面
if (stocks.indexOf(currentCode) > -1) {
    chrome.runtime.sendMessage({todo: 'relay', event: 'view_k', url: 'https://xueqiu.com/S/*', code: currentCode});
}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// 匹配 http://basic.10jqka.com.cn/300677/company.html
if (/^\/\d{6}\/company.html/img.test(location.pathname)) {

    createLinks();

    createNav();

    if(!openByShandy && location.href.endsWith('company.html')){
        throw new Error('结束。');
    }


    chrome_storage.get('stock', function (dob) {

        return console.log(dob);

        // 自动显示页面列表
        if (dob.relation) {

            let start_item = {d: 1};
            let queue = [];
            let interval = dob.interval || 30;
            let total = 0;

            if (dob.pages) {
                dob.pages.forEach((v) => {
                    let k = v.id;
                    if (urlMap[k] === location.href.replace(/[?#].*$/, '')) {
                        start_item = v;
                        total += v.d;
                    } else {
                        if (v.show) {
                            total += v.d;
                            queue.push({url: urlMap[v.id], duration: v.d * interval});
                        }
                    }
                });
            } else {
                queue = [
                    {url: urlMap.ycj, duration: interval * 2},
                    {url: urlMap.ths_new, duration: interval * 1},
                    {url: urlMap.ths_c, duration: interval * 1},
                    //{url: url_map.site, duration: interval * 6}
                ];
            }

            titleTimer(interval, total);

            setTimeout(function () {
                g(queue, function () {
                    openByShandy ? activeFtnn() : dob.queue && goToNext(next);
                });
            }, 1000 * interval * start_item.d);

        }

        // dob.queue => 自动切换股票列表,  如果为false, 手动切换股票列表
        if(dob.manual && !dob.queue && dob.relation && stocks.length){
            $body.on('mousewheel', callback);
        }

    });

}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// 匹配 http://basic.10jqka.com.cn/300677/
if (/^\/\d{6}\/?$/img.test(location.pathname)) {

    //document.documentElement.scrollTop = 38;

    setTimeout(function () {
        let $elm = $('.header .subnav li:nth-child(2) a');
        $elm[0].click();

        let $more = $('#compareCompanyList .more-company-btn').eq(0);
        $more[0].click();
    }, 3000);

    $('#profile table td a.alltext').attr('target', '_blank');

    //$('.wrapper').addClass('J');
    //$body.append('<iframe src="*"></iframe>'.replace('*', url));
    $body.append(`<div style="position:fixed;top:30%;right:0;width:80px;display: flex;flex-direction: column; font-size:1.2em;line-height:2;">${html}</div>`)

}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
if (/\/news\.html$/.test(location.pathname)) {

    setTimeout(function () {
        $('li a[name="news.html#mine"]')[0].click();
    }, 100);

}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
if (/\/concept\.html$/.test(location.pathname)) {

    $('.conAllBtn').each(function(){
        this.click();
    });

    setTimeout(function () {
        document.documentElement.scrollTop = 280;
    }, 10000);

}
