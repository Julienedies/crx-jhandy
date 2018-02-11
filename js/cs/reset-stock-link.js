/**
 * Created by j on 18/2/11.
 * 修改淘股吧实盘比赛选手实盘纪录链接方便复盘。
 */

//alert('I am reset-stock-link.js.');
var w; //新窗口引用。

$(document.body).on('click', 'a[href^=https://shuo.taoguba.com.cn/stockBarWeibo?stockCode=]', function(e){
    var that = e.target;
    if(!that._href){
        var code = that.href.match(/[^=]{8}$/)[0];
        that._href = 'https://gupiao.baidu.com/stock/sh601989.html'.replace(/[^/]{8}(?=\.html$)/i,code);
    }

    if(w){
        w.location.href = that._href;
        w.focus();
    }else{
        w = window.open(that._href);
    }

    return false;
});