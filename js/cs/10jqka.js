/**
 * Created by j on 18/3/9.
 * 1.修改同花顺个股资料页面样式，鼠标滚动切换个股
 * 2.同步新浪或雪球个股页面K线显示
 */

//alert('I am 10jqka.js.');

STOCKS = STOCKS || [];

if(location.search.match(/\?self[=][1]/)){
    STOCKS = [];
}
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

function getNameByCode(code){
    var item = STOCKS.filter(function(item){
        return item && item[0] == code;
    });
    return item[0] && item[0][1];
}

var goToNext = function (code) {
    console.log('goto:', code);
    if(code){
        location.href = location.href.replace(reg, '/' + code + '/');
    }else{
        chrome.runtime.sendMessage({todo: 'close_tab,active_ftnn', event: 'active_ftnn', url: location.href.replace('company.html?self=1','')});
    }
};

var callback = function (e) {
    //正负值表示滚动方向
    var isUp = e && e.originalEvent.deltaY < 0;
    goToNext(isUp ? prev : next);
};

var createNav = function () {
    var $c = $('<div style="position:fixed;bottom:0;right:0;background: rgba(0,0,0,0.6);color:white;z-index:10000;line-height: 2.8;width:5em;text-align: center;cursor: pointer; font-size: 1.3em;"></div>').appendTo($body);
    var $prev = $('<div>  *</div>'.replace('*', getNameByCode(prev) )).appendTo($c).on('click', function () {
        goToNext(prev);
    });
    var $next = $('<div>  *</div>'.replace('*', getNameByCode(next) )).appendTo($c).on('click', function () {
        goToNext(next);
    });
};

var createLinks = function () {
    var html = '<span> &nbsp; <a href="#" target="_blank">雪球</a>&nbsp; <a href="*" target="_blank">云财经</a></span>'
        .replace('#', xueqiu_url)
        .replace('*', ycj_url);
    //$url = $('iframe').contents().find('#detail a').eq(0);
    var $url = $('#detail a').eq(0).after(html);
    site_url = $url.attr('href');
};

var createIframe = function(){
    var href = location.href;
    var url = /company.html$/.test(href) ? href.replace('company.html', '') : href + 'company.html';
    $body.append('<iframe src="*"></iframe>'.replace('*', url));
};

var titleTimer = function (interval, amount) {
    var $title = $('title');
    var title = $title.text();
    var timer = interval * amount;
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
                chrome.runtime.sendMessage({todo: 'close_tab', url: url});
            }
            g(arr, callback);
        }, item.duration * 1000);
    } else {
        callback();
    }
}

//发送消息给background.js，通过background.js同步个股K线页面
if (stocks.indexOf(current) > -1) {
    console.log(current);
    chrome.runtime.sendMessage({todo: 'relay', event:'view_k', url:'https://xueqiu.com/S/*', code: current});
}

// 匹配 http://basic.10jqka.com.cn/300677/company.html
if (/^\/\d{6}\/company.html/img.test(location.pathname)) {

    createLinks();

    createNav();

    chrome_storage.get('stock', function (dob) {

        console.log(dob);

        if (dob.switch) {

            var interval = dob.interval || 30;

            var queue = [
                {url: ycj_url, duration: interval * 2},
                {url: ths_new_url, duration: interval * 1},
                {url: ths_c_url, duration: interval * 1},
                //{url: site_url, duration: interval * 6}
            ];

            titleTimer(interval, 4);

            setTimeout(function () {
                g(queue, function(){
                    goToNext(next);
                });
            },  1000 * interval * 1);

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
