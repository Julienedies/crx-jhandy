/**
 * Created by j on 18/6/20.
 */

console.log('I am jhandy.js');

chrome.runtime.onMessage.addListener(function (msg) {

    console.log(msg);

    var e = msg.event;

    if (e == 'active_ftnn') {
        $('#active_ftnn').click();
    } else if (e == 'tdx_view') {
        $('#tdx_view').attr('code', msg.code).click();
    }

});