/**
 * Created by j on 18/3/9.
 */

//alert('I am 10jqka.js.');

STOCK_CODE = STOCK_CODE.map(function(x){
    return x[0];
});
var reg = /\/(\d{6})\//;
var current = location.href.match(reg)[1];
var index = STOCK_CODE.indexOf(current);
var prev = index - 1 < 0 ? STOCK_CODE.length - 1 : index - 1;
var next = index + 1 > STOCK_CODE.length - 1 ? 0 : index + 1;

var href = location.href;
var url = /company.html$/.test(href) ? href.replace('company.html','') : href + 'company.html';
var $body = $(document.body);
$body.append('<iframe src="*"></iframe>'.replace('*', url));

$body.on('mousewheel', function (e) {

    //正负值表示滚动方向
    var isUp = e.originalEvent.deltaY < 0;

    var href = location.href.replace(reg, '/' + ( isUp ? STOCK_CODE[prev] : STOCK_CODE[next] ) + '/');

    console.log(href);

    location.href = href;

    return false;
});


/*$(function($){
    console.log('timer');
    setTimeout(function(){
        $('#tableList .check_details').click();
    }, 1000);
});*/
