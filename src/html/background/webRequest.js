/**
 * Created by j on 18/8/4.
 * webRequest 请求处理
 */

function callback (details) {
    console.log(details.url);
    // https://www.iwencai.com/stockpick/cache?token=f190db02092f28a9ef60be6c926616c0&p=1&perpage=50&changeperpage=1&showType=
    let reg = /[&]perpage[=](?:10|30|50)/;
    if (reg.test(details.url)) {
        let url = details.url.replace(reg, '&perpage=70');
        return {redirectUrl: url};
    }
    return {};
}

chrome.webRequest.onBeforeRequest.addListener(callback, {urls: ["https://www.iwencai.com/*"]}, ["blocking"]);


