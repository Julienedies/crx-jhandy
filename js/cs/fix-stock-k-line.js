/**
 * Created by j on 18/2/11.
 * 股票K线页面样式调整。
 */

//alert('fix-stock-k-line.js');

//接收同花顺页面发来的个股code
function on_message_callback(message, sender, sendResponse) {
    var code = message.code;
    if (code) {
        code = /^6/.test(code) ? 'sh' + code : 'sz' + code;
        var _href = location.href.replace(/[sS][hHzZ]\d{6}/, code);
        if(_href !=location.href) {
            location.href = _href;
        }
    }
}

//接收同花顺页面发来的个股code
chrome.runtime.onMessage.addListener(on_message_callback);

var host = location.host;

//新浪财经个股页面 http://finance.sina.com.cn/realstock/company/sz000702/nc.shtml
if(host.match('sina')){

    $('[data-id="KKE_tab_kd"]').click();
    $('.kke_cfg_fullscreen').click();

    $(document.body).append('<div style="z-index:10000;position:fixed;top:13px;right:120px;color:blue;font-size:1.5em;">' + $('title').text().split('_')[0] + '</div>');
}


//雪球个股页面 https://xueqiu.com/S/SZ300686
if(host.match('xueqiu')){
    document.documentElement.scrollTop = 25;
    setTimeout(function(){
        $('.stockChart [data-period="1day"]').click();
        $('.stockChart .enter-fs a').click();
    }, 500);
}


//百度个股页面
//document.documentElement.scrollTop = 310;
//$('#main-chart-tab li:eq(2)').click();


