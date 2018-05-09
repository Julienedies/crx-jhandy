/**
 * Created by j on 18/5/9.
 * 财联社页面有新消息，朗读出来。
 */

$(function () {

    chrome.storage.sync.get('is_speak', function (result) {
        if (result.is_speak) {

            var elm = document.querySelectorAll("div.contentLeft > div")[1];
            var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
            var MutationObserverConfig = {
                childList: true,
                subtree: true,
                characterData: true
            };
            var observer = new MutationObserver(function (mutations) {
                //console.log(mutations);
                var speechSU = new window.SpeechSynthesisUtterance();
                speechSU.text = $(elm).find('>div:eq(1) p').text() || 'hello world!';
                window.speechSynthesis.speak(speechSU);
            });
            observer.observe(elm, MutationObserverConfig);

        }
    });

});