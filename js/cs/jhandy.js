/**
 * Created by j on 18/6/20.
 */

console.log('I am jhandy.js');

// 是否股市开盘时间
function is_on_the_exchange(){
    var d = new Date();
    var z = d.getDay();
    var h = d.getHours();
    if( z > 0 && z < 6 && h > 8 && h < 15) {
        return true;
    }
    return false;
}

chrome.runtime.onMessage.addListener(function (msg) {

    console.log(msg);

    var e = msg.event;

    if (e == 'active_ftnn') {

        is_on_the_exchange() && $('#active_ftnn').click();

    } else if (e == 'view_in_tdx') {
        $('#tdx_view').attr('code', msg.code).click();
    }

});