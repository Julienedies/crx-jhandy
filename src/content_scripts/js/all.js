/*!
 * content script
 * 该脚本会注入到所有访问过的页面， 通过manifest.json配置
 * Created by j on 18/9/15.
 */


/*
 * 配合shandy使用，如果一个打开的标签窗口的location.href里面包含close的query字符串，会触发定时关闭的功能
 * 譬如：http://www.a.com/a.html?close=30,  表示30秒后关闭该标签窗口
 */
;(() => {
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
})();



