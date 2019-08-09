/*!
 * Created by j on 18/9/15.
 * chrome content script
 */

// 定时关闭当前窗口
let arr = location.href.match(/\?close=(\d+)$/i) || [];
let q = arr[0];
let d = arr[1];

if (d) {
    chrome.runtime.sendMessage({
        todo: 'close_tab',
        event: 'close_tab',
        delay: d,
        url: location.href
    });
}


