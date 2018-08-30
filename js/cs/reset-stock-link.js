/**
 * Created by j on 18/2/11.
 * 修改淘股吧实盘比赛选手实盘纪录个股链接，方便复盘。
 */

console.log('I am reset-stock-link.js.');
var w; //新窗口引用。

//将淘股吧里的股票code添加股票名称，方便识别。
$('a').each(function(){
    var $th = $(this);
    var code = $th.text().replace(/(^\s+)|(\s+$)/img, '');
    if(/^[036]\d{5}$/.test(code)){
        for(var i in STOCK_LIST){
            if(STOCK_LIST[i][0] == code){
                console.log(code);
                $th.text(code + '(*)'.replace('*', STOCK_LIST[i][1]));
                return;
            }
        }
    }
});

$(document.body).on('click', 'a[href*=https://www.taoguba.com.cn/quotes/], a[href^="/public/static/img/p/"]', function(e){
    var that = e.target;
    var  code = that.href.match(/\w{2}\d{6}(?!\d)/)[0];
    //console.log('tdx_view', code);
    //chrome.runtime.sendMessage({event: 'view_in_tdx', code: code.replace(/[szh]*/img,'')});
    //return false;
    if(!that._href){
        if(location.host == "127.0.0.1:2018"){
            code = that.href.match(/[^/]{6}(?=\.png)/i)[0];
            code = /^6\d{5}$/.test(code) ? 'sh' + code : 'sz' + code;
        }else{
            code = that.href.match(/\w{2}\d{6}(?!\d)/)[0];
            //chrome.runtime.sendMessage({event: 'tdx_view', code: code.replace(/[szh]*/img,'')});
        }

        //富途股票页面
        //'https://www.futunn.com/quote/stock?m=sz&code=002898';
        //百度股票页面
        //that._href = 'https://gupiao.baidu.com/stock/sh601989.html'.replace(/[^/]{8}(?=\.html$)/i,code);
        //新浪股票页面
        //that._href = 'http://finance.sina.com.cn/realstock/company/sh600519/nc.shtml'.replace(/[^/]{8}(?=\/nc\.shtml$)/i,code);
        //雪球
        that._href = 'https://xueqiu.com/S/'+ code;
    }

    if(w && !w.closed){
        w.location.href = that._href;
        w.focus();
    }else{
        w = window.open(that._href);
    }

    return false;
});