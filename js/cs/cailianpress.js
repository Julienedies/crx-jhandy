/**
 * Created by j on 18/5/9.
 * 财联社页面有新消息，朗读出来。
 */

console.log('I am cailianpress.js');

$(function () {

    chrome_storage.get('cls.speak', function (result) {

        console.log(result);

        if (result) {

            var speechSU = new window.SpeechSynthesisUtterance();

            var elm = $("div.contentLeft > div")[1];
            var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

            var MutationObserverConfig = {
                childList: true,
                subtree: true,
                characterData: true
            };
            var observer = new MutationObserver(function (mutations) {
                //console.log(mutations);
                speechSU.text = $(elm).find('>div:eq(1) p').text() || 'hello world!';
                speechSynthesis.speak(speechSU);
            });

            observer.observe(elm, MutationObserverConfig);

        }
    });

});