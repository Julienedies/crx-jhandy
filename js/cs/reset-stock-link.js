/**
 * Created by j on 18/2/11.
 * 修改淘股吧实盘比赛选手实盘纪录链接方便复盘。
 */

//alert('I am reset-stock-link.js.');
var w; //新窗口引用。

$(document.body).on('click', 'a[href*=https://shuo.taoguba.com.cn/stockBarWeibo?stockCode=], a[href^=https://www.taoguba.com.cn/barRedirect?stockCode=], a[href^="/public/static/img/p/"]', function(e){
    var that = e.target;
    var code;
    if(!that._href){
        if(location.host == "127.0.0.1:2018"){
            code = that.href.match(/[^/]{6}(?=\.png)/i)[0];
            code = /^6\d{5}$/.test(code) ? 'sh' + code : 'sz' + code;
        }else{
            code = that.href.match(/[^=]{8}$/)[0];
        }

        //'https://www.futunn.com/quote/stock?m=sz&code=002898' //富途股票页面
        //that._href = 'https://gupiao.baidu.com/stock/sh601989.html'.replace(/[^/]{8}(?=\.html$)/i,code); //百度股票页面
        that._href = 'http://finance.sina.com.cn/realstock/company/sh600519/nc.shtml'.replace(/[^/]{8}(?=\/nc\.shtml$)/i,code); //新浪股票页面
    }

    if(w && !w.closed){
        w.location.href = that._href;
        w.focus();
    }else{
        w = window.open(that._href);
    }

    return false;
});