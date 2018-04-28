/**
 * Created by j on 18/4/26.
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

setTimeout(function(){
    $('.stockChart [data-period="1day"]').click();
    //console.log($('.stockChart .enter-fs a').text());
    $('.stockChart .enter-fs a').click();
}, 500);