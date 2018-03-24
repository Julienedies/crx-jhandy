/**
 * Created by j on 18/2/11.
 * 股票页面样式调整。
 */

document.documentElement.scrollTop = 310;

//$('#main-chart-tab li:eq(2)').click();

$('[data-id="KKE_tab_kd"]').click();
$('.kke_cfg_fullscreen').click();

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    var code = message.code;
    if(code){
        code = /^6/.test(code) ? 'sh' + code : 'sz' + code;
        location.href = location.href.replace(/s[hz]\d{6}/, code);
    }
    /*if (message.greeting == "hello"){
        Mymessage = message.theMessage;
        alert(Mymessage);
    }
    else{
        sendResponse({});
    }*/
});
