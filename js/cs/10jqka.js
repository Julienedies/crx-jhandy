/**
 * Created by j on 18/3/9.
 */

//alert('I am 10jqka.js.');

var reg = /\/(\d{6})\//;
var current = location.href.match(reg)[1];
var index = STOCK_CODE.indexOf(current);
var prev = index - 1 < 0 ? STOCK_CODE.length - 1 : index - 1;
var next = index + 1 > STOCK_CODE.length - 1 ? 0 : index + 1;

console.log(index, prev, current , next);

$(document.body).on('mousewheel', function (e) {

    //正负值表示滚动方向
    var isUp = e.originalEvent.deltaY < 0;

    var href =  location.href.replace(reg, '/' + ( isUp ? STOCK_CODE[prev] : STOCK_CODE[next] ) + '/');

    console.log(href);

    location.href = href;

    return false;
});