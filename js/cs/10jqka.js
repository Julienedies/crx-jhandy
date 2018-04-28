/**
 * Created by j on 18/3/9.
 * 1.修改同花顺个股资料页面样式，鼠标滚动切换个股
 * 2.同步新浪或雪球个股页面K线显示
 */

//alert('I am 10jqka.js.');

STOCK_CODE = STOCK_CODE.map(function (x) {
    return x[0];
});
var reg = /\/(\d{6})\//;
var current = location.href.match(reg)[1];
var index = STOCK_CODE.indexOf(current);
var prev = index - 1 < 0 ? STOCK_CODE.length - 1 : index - 1;
var next = index + 1 > STOCK_CODE.length - 1 ? 0 : index + 1;

//发送消息给background.js，通过background.js同步个股K线页面
//if(STOCK_CODE.indexOf(current) > -1){
    chrome.runtime.sendMessage({id: '10jqka', code: current});
//}

var href = location.href;
var url = /company.html$/.test(href) ? href.replace('company.html', '') : href + 'company.html';

var $body = $(document.body);

//如果是个股资料页面
if (/^http:\/\/basic\.10jqka\.com.cn\/\d{6}\/?$/img.test(location.href)) {

    $('.wrapper').addClass('J');
    $body.append('<iframe src="*"></iframe>'.replace('*', url));

    var callback = function (e) {

        //正负值表示滚动方向
        var isUp = e && e.originalEvent.deltaY < 0;

        var href = location.href.replace(reg, '/' + ( isUp ? STOCK_CODE[prev] : STOCK_CODE[next] ) + '/');

        console.log(href);

        location.href = href;

        return false;
    };

    $body.on('mousewheel', callback);
}




