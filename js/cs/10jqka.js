/**
 * Created by j on 18/3/9.
 * 1.修改同花顺个股资料页面样式，鼠标滚动切换个股
 * 2.同步新浪或雪球个股页面K线显示
 */

console.log('I am 10jqka.js.');

STOCKS = STOCKS || [];

var only_self;

var reg = /\/(\d{6})\//;
var current_code = location.href.match(reg)[1];

// only_self 页面
if (only_self = location.search.match(/\?self[=][1]/)) {  // 赋值and做条件判断
    STOCKS = [];
    chrome.runtime.sendMessage({event: 'only_self', code: current_code, url: location.href});
}

chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse){
    if(msg.event == 'only_self' && msg.code != current_code){
        chrome.runtime.sendMessage({
            event: 'close_tab',
            code: current_code,
            url: [location.href.replace('company.html?self=1', ''), url_map.ycj]
        });
    }
});


var stocks = STOCKS.map(function (x) {
        return x[0];
    }) || [];


var index = stocks.indexOf(current_code);
var prev = stocks[index - 1] || stocks[stocks.length - 1];
var next = stocks[index + 1] || stocks[0];

var prefix_code = (/^6/.test(current_code) ? 'sh' : 'sz') + current_code;

var url_map = {
    ycj: 'http://www.yuncaijing.com/quote/*.html'.replace('*', prefix_code),
    xueqiu: 'https://xueqiu.com/S/*'.replace('*', prefix_code),
    ths_p: 'http://basic.10jqka.com.cn/*/company.html'.replace('*', current_code),
    ths_new: 'http://basic.10jqka.com.cn/*/'.replace('*', current_code),
    ths_c: 'http://basic.10jqka.com.cn/*/concept.html'.replace('*', current_code),
    ths_news: 'http://basic.10jqka.com.cn/*/news.html'.replace('*', current_code),
    site: ''
};

var $body = $(document.body);

function getNameByCode(code) {
    var item = STOCKS.filter(function (item) {
        return item && item[0] == code;
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

function active_ftnn(){
    chrome.runtime.sendMessage({
        todo: 'active_ftnn',
        event: 'active_ftnn'
    });
}

var goToNext = function (code) {
    console.log('goto:', code);
    if (code) {
        location.href = location.href.replace(reg, '/' + code + '/');
    }
};

var callback = function (e) {
    //正负值表示滚动方向
    var isUp = e && e.originalEvent.deltaY < 0;
    goToNext(isUp ? prev : next);
};

var createNav = function () {
    var $c = $('<div style="position:fixed;bottom:0;right:0;background: rgba(0,0,0,0.6);color:white;z-index:10000;line-height: 2.8;width:5em;text-align: center;cursor: pointer; font-size: 1.3em;"></div>').appendTo($body);
    var $prev = $('<div>  *</div>'.replace('*', getNameByCode(prev))).appendTo($c).on('click', function () {
        goToNext(prev);
    });
    var $next = $('<div>  *</div>'.replace('*', getNameByCode(next))).appendTo($c).on('click', function () {
        goToNext(next);
    });
};

var createLinks = function () {
    var html = '<span> &nbsp; <a href="#" target="_blank">雪球</a>&nbsp; <a href="*" target="_blank">云财经</a></span>'
        .replace('#', url_map.xueqiu)
        .replace('*', url_map.ycj);
    //$url = $('iframe').contents().find('#detail a').eq(0);
    var $url = $('#detail a').eq(0).after(html);
    url_map.site = $url.attr('href');
};

var createIframe = function () {
    var href = location.href;
    var url = /company.html$/.test(href) ? href.replace('company.html', '') : href + 'company.html';
    $body.append('<iframe src="*"></iframe>'.replace('*', url));
};

var titleTimer = function (interval, amount) {
    var $title = $('title');
    var title = $title.text();
    var count = Math.floor(interval * amount);
    var timer = setInterval(function () {
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
    var win;
    var url;
    var item = arr.shift();
    if (item) {
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
if (stocks.indexOf(current_code) > -1) {
    chrome.runtime.sendMessage({todo: 'relay', event: 'view_k', url: 'https://xueqiu.com/S/*', code: current_code});
}

// 匹配 http://basic.10jqka.com.cn/300677/company.html
if (/^\/\d{6}\/company.html/img.test(location.pathname)) {

    createLinks();

    createNav();

    chrome_storage.get('stock', function (dob) {

        console.log(dob);

        // 自动显示页面列表
        if (dob.relation) {

            var start_item = {d: 1};
            var queue = [];
            var interval = dob.interval || 30;
            var total = 0;

            if (dob.pages) {
                dob.pages.forEach((v) => {
                    var k = v.id;
                    if (url_map[k] == location.href.replace(/[?#].*$/, '')) {
                        start_item = v;
                        total += v.d;
                    } else {
                        if (v.show) {
                            total += v.d;
                            queue.push({url: url_map[v.id], duration: v.d * interval});
                        }
                    }
                });
            } else {
                queue = [
                    {url: url_map.ycj, duration: interval * 2},
                    {url: url_map.ths_new, duration: interval * 1},
                    {url: url_map.ths_c, duration: interval * 1},
                    //{url: url_map.site, duration: interval * 6}
                ];
            }

            titleTimer(interval, total);

            setTimeout(function () {
                g(queue, function () {
                    only_self ? active_ftnn() : dob.queue && goToNext(next);
                });
            }, 1000 * interval * start_item.d);

        }

        // dob.queue => 自动切换股票列表,  如果为false, 手动切换股票列表
        if(!dob.queue && dob.relation && stocks.length){
            $body.on('mousewheel', callback);
        }

    });

}

// 匹配 http://basic.10jqka.com.cn/300677/
if (/^\/\d{6}\/?$/img.test(location.pathname)) {

    //document.documentElement.scrollTop = 38;

    setTimeout(function () {
        var $elm = $('.header .subnav li:nth-child(2) a');
        $elm[0].click();
    }, 4000);

    $('#profile table td a.alltext').attr('target', '_blank');

    //$('.wrapper').addClass('J');
    //$body.append('<iframe src="*"></iframe>'.replace('*', url));

}


if (/news\.html$/.test(location.pathname)) {
    setTimeout(function () {
        $('li a[name="news.html#mine"]')[0].click();
    }, 100);

}