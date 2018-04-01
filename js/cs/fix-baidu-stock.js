/**
 * Created by j on 18/2/11.
 * 股票页面样式调整。
 */

//同步同花顺个股
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    var code = message.code;
    if (code) {
        code = /^6/.test(code) ? 'sh' + code : 'sz' + code;
        var _href = location.href.replace(/s[hz]\d{6}/, code);
        if(_href !=location.href) {
            location.href = _href;
        }
    }
});


document.documentElement.scrollTop = 310;

//百度个股页面
//$('#main-chart-tab li:eq(2)').click();

//新浪财经个股页面 http://finance.sina.com.cn/realstock/company/sz000702/nc.shtml
$('[data-id="KKE_tab_kd"]').click();
$('.kke_cfg_fullscreen').click();

$(document.body).append('<div style="z-index:10000;position:fixed;top:13px;right:120px;color:blue;font-size:1.5em;">' + $('title').text().split('_')[0] + '</div>');



/*
$(document.body).on('mousewheel', function(e){
    e.originalEvent;
    console.log(e.originalEvent);
});*/
