/**
 * Created by j on 18/6/20.
 */

console.log('I am jhandy.js');

chrome.runtime.onMessage.addListener(function (msg) {

    console.log(msg);

    var e = msg.event;

    if (e == 'active_ftnn') {

        let d = new Date();
        let h = d.getHours();

        if(h > 8 && h < 15) {
            $('#active_ftnn').click();
        }

    } else if (e == 'view_in_tdx') {
        $('#tdx_view').attr('code', msg.code).click();
    }

});