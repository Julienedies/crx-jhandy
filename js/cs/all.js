/*!
 * Created by j on 18/9/15.
 * chrome content script
 */

var arr = location.href.match(/\?close=(\d+)$/i) || [];
var q = arr[0];
var d = arr[1];

if (d) {
    chrome.runtime.sendMessage({
        todo: 'close_tab',
        event: 'close_tab',
        delay: d,
        url: location.href
    });
}


