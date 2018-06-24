/**
 * Created by j on 18/6/24.
 */

chrome_storage = (function () {
    return {
        get: function (key, callback) {
            let that = this;
            if (typeof key == 'function') {
                callback = key;
                key = undefined;
            }
            chrome.storage.sync.get(null, function (result) {
                if (key) {
                    let obj = that._get(key, result);
                    callback(obj || {});
                } else {
                    callback(result);
                }
            });
        },
        set: function (key, value, callback) {
            var map = {};
            if (typeof key == 'object') {
                if (typeof value == 'function') {
                    callback = value;
                }
                return chrome.storage.sync.set(key, callback);
            }
            map[key] = value;
            chrome.storage.sync.set(map, callback);
        },
        remove: function (key, callback) {
            chrome.storage.sync.remove(key);
        },
        clear: function () {
            chrome.storage.sync.clear();
        },
        on_changed: function (key, callback) {
            let that = this;
            if(typeof key == 'function'){
                callback = key;
                key = undefined;
            }
            chrome.storage.onChanged.addListener(function (changes, namespace) {
                if(key){
                    let obj = that._get(key, changes);
                    obj && callback(obj);
                }else{
                    callback(changes);
                }
            });
        },
        _get: function(key, dob){
            let obj = {};
            let count = 0;
            for (var i in dob) {
                if (i == key) {
                    return dob[i];
                } else if (i.indexOf(key + '.') > -1) {
                    count += 1;
                    obj[i.replace(key + '.', '')] = dob[i];
                }
            }
            return count ? obj : undefined;
        }

    };
})();

chrome_tabs = (function () {

    return {
        query: function (url, callback) {
            let _url = url;
            let pattern = url.indexOf('*') > -1;
            if (!pattern) {
                _url = url.replace(/https?:\/\/([^/]+).*/, '*//$1/*');
            }
            console.log(url, ' --------- ', _url);
            chrome.tabs.query({url: _url}, function (tabs) {
                tabs = tabs.filter(tab => {
                    console.log(tab);
                    return pattern || tab.url.indexOf(url) > -1;
                });
                callback(tabs);
            });

        },
        reload: function (id, callback) {
            if (Array.isArray(id)) {
                id.map(function (tab) {
                    chrome.tabs.reload(tab.id, callback);
                });
            }
        },
        remove: function(url){
            this.query(url, function(tabs){
                tabs = tabs.map(function(tab){
                    return tab.id;
                });
                chrome.tabs.remove(tabs);
            });
        },
        sendMessage: function(url, request){
            this.query(url, function(tabs){
                tabs.map(function(tab){
                    chrome.tabs.sendMessage(tab.id, request);
                })
            });
        }
    }


})();