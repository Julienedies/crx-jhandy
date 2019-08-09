/**
 * Created by j on 18/5/7.
 * for 云财经页面
 */


var code = location.href.match(/\d{6}(?=\.html)/)[0];

var url = 'http://basic.10jqka.com.cn/*/'.replace('*', code);

$('#qingbao-page .stock-tab').append('<a href="*" target="_blank">同花顺</a>'.replace('*', url));

$(document.body).on('dblclick', function(){
});