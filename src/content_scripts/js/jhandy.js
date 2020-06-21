/**
 * Created by j on 18/6/20.
 */

import $ from 'jquery';
import utils from '../../js/lib/utils'

console.log('I am jhandy.js');


let $notify_news = $('#notify_news');
let $tdx_view = $('#tdx_view');
let $active_ftnn = $('#active_ftnn');

chrome.runtime.onMessage.addListener(function (msg) {

    console.info(msg.event, msg);

    let e = msg.event;

    if (e === 'active_ftnn') {

        utils.isTradingTime() && $active_ftnn.click();

    } else if (e === 'view_in_tdx' || e === 'view_in_ftnn') {

        $tdx_view.attr('code', msg.code).attr('event', e).click();

    } else if (e === 'cls_news') {

        $notify_news.data('news', msg);
        $notify_news.text(msg.msg);
        $notify_news.click();

    }

});


// 是否股市开盘时间
function is_on_the_exchange () {
    let d = new Date();
    let z = d.getDay();
    let h = d.getHours();
    return z > 0 && z < 6 && h > 8 && h < 15;
}
