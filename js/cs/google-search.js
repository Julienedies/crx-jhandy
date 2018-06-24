/**
 * Created by j on 18/6/23.
 */

console.log(chrome.contextMenus)
chrome.contextMenus && chrome.contextMenus.create({
    title: '使用google搜索：%s', // %s表示选中的文字
    contexts: ['selection'], // 只有当选中文字时才会出现此右键菜单
    onclick: function(params)
    {
        // 注意不能使用location.href，因为location是属于background的window对象
        chrome.tabs.create({url: 'https://www.google.com/search?q=' + encodeURI(params.selectionText)});
    }
});
