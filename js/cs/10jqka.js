/**
 * Created by j on 18/3/9.
 * 1.修改同花顺个股资料页面样式，鼠标滚动切换个股
 * 2.同步新浪或雪球个股页面K线显示
 */

//alert('I am 10jqka.js.');

STOCKS = STOCKS || [];
var stocks = STOCKS.map(function (x) {
        return x[0];
    }) || [];
var reg = /\/(\d{6})\//;
var current = location.href.match(reg)[1];
var index = stocks.indexOf(current);
var prev = stocks[index - 1] || stocks[stocks.length - 1];
var next = stocks[index + 1] || stocks[0];

var prefix_code = (/^6/.test(current) ? 'sh' : 'sz') + current;
var ycj_url = 'http://www.yuncaijing.com/quote/*.html'.replace('*', prefix_code);
var xueqiu_url = 'https://xueqiu.com/S/*'.replace('*', prefix_code);
var ths_new_url = 'http://basic.10jqka.com.cn/*/'.replace('*', current);
var ths_c_url = 'http://basic.10jqka.com.cn/*/concept.html'.replace('*', current);
var site_url;

var $body = $(document.body);

var goToNext = function (code) {
    if(code){
        location.href = location.href.replace(reg, '/' + code + '/');
    }else{
        chrome.runtime.sendMessage({id: '10jqka', close_url: location.href});
    }
};

var callback = function (e) {
    //正负值表示滚动方向
    var isUp = e && e.originalEvent.deltaY < 0;
    goToNext(isUp ? prev : next);
};

var createNav = function () {
    var $c = $('<div style="position:fixed;bottom:0;right:0;background: rgba(0,0,0,0.6);color:white;z-index:10000;line-height: 2;width:4em;text-align: center;cursor: pointer; font-size: 1.4em;"></div>').appendTo($body);
    var $prev = $('<div> prev (*)</div>'.replace('*', prev)).appendTo($c).on('click', function () {
        goToNext(prev);
    });
    var $next = $('<div> next (*)</div>'.replace('*', next)).appendTo($c).on('click', function () {
        goToNext(next);
    });
};

var createLinks = function () {
    setTimeout(function () {
        var html = '<span> &nbsp; <a href="#" target="_blank">雪球</a>&nbsp; <a href="*" target="_blank">云财经</a></span>'
            .replace('#', xueqiu_url)
            .replace('*', ycj_url);
        //$url = $('iframe').contents().find('#detail a').eq(0);
        var $url = $('#detail a').eq(0).after(html);
        site_url = $url.attr('href');
    }, 500);
};

var createIframe = function(){
    var href = location.href;
    var url = /company.html$/.test(href) ? href.replace('company.html', '') : href + 'company.html';
    $body.append('<iframe src="*"></iframe>'.replace('*', url));
};

var titleTimer = function (interval) {
    var $title = $('title');
    var title = $title.text();
    var timer = interval * (2 + 2 + 1 + 3 + 1);
    setInterval(function () {
        timer -= 1;
        $title.text(timer + ' # ' + title);
    }, 1000);
};

/**
 *
 * @param arr Array  => [{url:'', duration: 30}] 要访问的站点队列
 * @param callback Function
 **/
function g(arr, callback) {
    var win;
    var item = arr.shift();
    var url;
    if (item) {
        url = item.url;
        win = window.open(url);
        setTimeout(function () {
            if (url.search(location.host) > -1) {
                win.close();
            } else {
                chrome.runtime.sendMessage({id: '10jqka', close_url: url});
            }
            g(arr, callback);
        }, item.duration * 1000);
    } else {
        callback();
    }
}

//发送消息给background.js，通过background.js同步个股K线页面
if (stocks.indexOf(current) > -1) {
    //chrome.runtime.sendMessage({id: '10jqka', code: current});
}

// 匹配 http://basic.10jqka.com.cn/300677/company.html
if (/^\/\d{6}\/company.html/img.test(location.pathname)) {

    createLinks();

    createNav();

    chrome.storage.sync.get(['is_stock_auto', 'interval'], function (result) {

        console.log(result);

        if (result.is_stock_auto) {

            var interval = result.interval || 30;

            titleTimer(interval);

            var queue = [
                {url: ths_new_url, duration: interval * 2},
                {url: ths_c_url, duration: interval * 2},
                {url: ycj_url, duration: interval * 2},
                {url: site_url, duration: interval * 10}
            ];

            setTimeout(function () {
                g(queue, function(){
                    goToNext(next);
                });
            }, interval * 2 * 1000);

        } else {

            $body.on('mousewheel', callback);

        }
    });

}

// 匹配 http://basic.10jqka.com.cn/300677/
if (/^\/\d{6}\/?$/img.test(location.pathname)) {

    $('#profile table td a.alltext').attr('target', '_blank');

    //$('.wrapper').addClass('J');
    //$body.append('<iframe src="*"></iframe>'.replace('*', url));

}




