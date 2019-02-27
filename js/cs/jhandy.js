/**
 * Created by j on 18/6/20.
 */

console.log('I am jhandy.js');

// 是否股市开盘时间
function is_on_the_exchange(){
    var d = new Date();
    var z = d.getDay();
    var h = d.getHours();
    return z > 0 && z < 6 && h > 8 && h < 15;
}

let $notify_news = $('#notify_news');
let $tdx_view = $('#tdx_view');
let $active_ftnn = $('#active_ftnn');

chrome.runtime.onMessage.addListener(function (msg) {

    console.log(msg);

    let e = msg.event;

    if (e === 'active_ftnn') {

        is_on_the_exchange() && $active_ftnn.click();

    }
    else if (e === 'view_in_tdx' || e === 'view_in_ftnn') {

        $tdx_view.attr('code', msg.code).attr('event', e).click();

    }
    else if(e === 'cls_news'){

        $notify_news.data('news', msg);
        $notify_news.text(msg.msg);
        $notify_news.click();

    }

});