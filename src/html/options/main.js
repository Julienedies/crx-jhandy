/**
 * Created by j on 18/6/23.
 */

import { chrome_storage, chrome_tabs } from '../../js/lib/chromeApi'
import utils from '../../js/lib/utils';

import 'bulma/bulma.sass'
import './style.scss'

import $ from 'jquery'
import brick from '@julienedies/brick'
import '@julienedies/brick/dist/brick.css'

/*let config = {"cls.notify":true,"cls.speak":false,"isEnableContextMenu.5NzA3Ni5zaHRtbA==":true,"isEnableContextMenu.ja19kaWFyeS5odG1s":false,"isEnableContextMenu.yNSVFMyU4MCU4Mg==":true,"noteTag.0NiM0NTQyMDM0Ng==":"短线至上","noteTag.1ZS9qdWJpYW4uaHRt":"走出幻觉走向成熟","noteTag.3MiM0NTQxODE3Mg==":"管手剁","noteTag.4MTU5JnBhZ2VObz0y":"92科比","noteTag.4MTU5JnBhZ2VObz0z":"92科比","noteTag.4aW56aHVhbmcuaHRt":"走出幻觉走向成熟","noteTag.4dWVzaGVuZy5odG0=":"金融帝国","noteTag.5OCM0NTQzNjk5OA==":"A短线女王","noteTag.FNCVCQiU5OS5odG1s":"瑞鹤仙","noteTag.FNSVBRSVCNi5odG1s":"炒股养家","noteTag.aHR0cDovL":"炒股养家","noteTag.aHR0cHM6L":"xxxx","noteTag.iaW5nc2hhbi5odG0=":"走出幻觉走向成熟","noteTag.ocD9pZD01NzQxMTA=":"1715891782g_hello/gz/2014","noteTag.ocD9pZD1rdW42bTc=":"hello/gz/2014","noteTag.sZS81NzA4NDUvMQ==":"好运2008","noteTag.sZS82Mzk4NDEvMQ==":"小鳄鱼","noteTag.sZS83MjM2ODkvMQ==":"小鳄鱼","noteTag.sZS85NTg5NjYvMQ==":"zhouyu1933","noteTag.sZS8xMDIxMjMxLzE=":"骑在牛股上","noteTag.sZS8xMTIzMTMzLzE=":"yxkrrhx","noteTag.sZS8xMTQ1Mzk2LzE=":"小鳄鱼","noteTag.sZS8xMTQ5NjQ5LzE=":"令胡冲","noteTag.sZS8xMTY5OTc0LzE=":"zhouyu1933","noteTag.sZS8xMTk0NjYwLzE=":"zhouyu1933","noteTag.sZS8xMjQ0ODE3LzE=":"zhouyu1933","noteTag.sZS8xMjQ1NzcxLzE=":"绝对客观","noteTag.sZS8xMzUyNzI5LzE=":"龙飞虎","noteTag.sZS8xNDQxMTU3LzE=":"Linsanity016","noteTag.sZS8xNDYwODU0LzE=":"骑在牛股上","noteTag.sZS8xNDc3NjI5LzE=":"涅盘重升","noteTag.sZS8xNTk0NDc4LzE=":"阿猪","noteTag.sZS8xNjI4OTEwLzE=":"退学炒股","noteTag.sZS8xNjQ4MTgwLzE=":"排头兵","noteTag.sZS8xNzA0ODg0LzE=":"作手新一 ","noteTag.sZS8xNzExMTMyLzE=":"飞扬1 ","noteTag.sZS8xNzEzODk1LzE=":"作手新一 ","noteTag.sZS8xNzU1MDEwLzE=":"古月湖","noteTag.sZS8xNzU2MDAvMQ==":"龙飞虎","noteTag.sZS8xNzgzNTcxLzE=":"ertdfg123456","noteTag.sZS8xODU0NDE3LzE=":"赣M城管希","noteTag.sZS8xODk4MDEwLzE=":"大成路旁","noteTag.sZS8xOTE2Mjc3LzE=":"管手剁","noteTag.sZS8yMDIyODQwLzE=":"Linsanity016","noteTag.sZS8yMjUyMTQxLzE=":"爱学习的人","noteTag.sZS8yNTM1NjQ3LzE=":" 轮回666","noteTag.sZS8yNTgxNjQzLzE=":"古月湖","noteTag.sZS8yNjc0OTE2LzE=":"管手剁","noteTag.sZS8yNzYwMDc2LzE=":"古月湖","noteTag.sZS8yOTMzMzM5LzE=":"zz_行者9966","noteTag.sZS8yOTk5NjIyLzE=":"Stkking","noteTag.sZS8zMDAwOTE4LzE=":"Stkking","noteTag.sZS8zMTk1OTgzLzE=":"闻少","noteTag.sZS8zMjA5MzY3LzE=":"最勤奋的股民","noteTag.sZS8zMjQyNzMzLzE=":"只会做龙头","noteTag.ucG9ybmh1Yi5jb20v":"hello_bp_2014","noteTag.wNCM0NDkxNzQwNA==":"短线至上","noteTag.wNSM0NTM4ODMwNQ==":"短线至上","noteTag.xNSM0OTQyNTIxNQ==":"yinfei5551","noteTag.ySUQ9MTExNjU4NQ==":"涅盘重升","noteTag.yZWFkZXIuaHRtbA==":"令胡冲","noteTag.zMCM0NTIyNzczMA==":"短线至上","noteTag.zZXJJRD00OTQ0Njk=":"令胡冲","noteTag.zZXJJRD04MjcyNjQ=":"作手新一","noteTag.zZXJJRD0xMTE2NTg1":"涅盘重升","noteTag.zZXJJRD0xNTkyNjg2":"退学炒股","noteTag.zZXJJRD0xOTQ4MDQ1":"短线至上","noteTag.zZXJJRD0yMTE1Mjgy":"rxybgb","stock.interval":"10","stock.pages":[{"d":0.1,"id":"ths_p","name":" 同花顺资料"},{"d":1.5,"id":"ycj","name":"云财经","show":false},{"d":2,"id":"wencai","name":"问财","show":false},{"d":19,"id":"ths_new","name":"同花顺动态","show":true},{"d":7,"id":"ths_c","name":"同花顺概念","show":false},{"d":6,"id":"ths_news","name":"同花顺新闻","show":false},{"d":3,"id":"taoguba","name":"淘股吧","show":false},{"d":1,"id":"xuangubao","name":"选股宝"}],"stock.queue":false,"stock.relation":true};

for(let i in config){
    chrome_storage.set(i, config[i]);
}*/

// chrome_storage.get(function (dob) {
//     console.log(JSON.stringify(dob));
// });

let urlKey = '';
let tabId;

chrome.tabs.getSelected(function (tab) {
    tabId = tab.id;
    urlKey = utils.createUrlKey(tab.url);
});

brick.set('render.wrapModel', true);

brick.reg('mainCtrl', function () {

    let scope = this;

    // 用于子控制器继承
    scope.on_checkbox_changed = function () {
        let $th = $(this);
        let name = $th.attr('name');
        let checked = $th.prop('checked');
        console.log(name, checked);
        chrome_storage.set(name, checked, (...args)=> {
            console.log(args);
        });
    };
});


brick.reg('stockCtrl', function () {

    let ListManager = brick.services.get('recordManager');
    let list = window.ll = new ListManager();

    let scope = this;
    let $elm = scope.$elm;

    function f (dob) {
        console.log(dob);
        scope.render('stock', dob);
        dob.pages && list.init(dob.pages);
        //console.table(list.get());
    }

    chrome_storage.get('stock', f);

    scope.set_interval = function () {
        let val = $elm.find('input[name=interval]').val() || 30;
        $elm.find('#show_interval').text(val);
        chrome_storage.set('stock.interval', val);
    };

    scope.on_page_changed = function () {
        let $th = $(this);
        let id = $th.val();
        let show = $th.prop('checked');
        list.find(id).set({show: show});
        chrome_storage.set('stock.pages', list.get());
    };

    scope.edit = function () {
        let $th = $(this);
        let id = $th.data('id');
        let p = list.get(id);
        console.log(p);
        let arr = [p.name, p.id, p.d, p.show];
        $elm.find('input[name=page]').val(arr.join(','));
    };

    scope.up = function () {
        let $th = $(this);
        let id = $th.data('id');
        let s = `#page_${ id }`;
        let $item = $th.closest(s);
        $item.insertBefore($item.prev());
        let item = list.find(id).prev();
        //console.table(list.get());
        chrome_storage.set('stock.pages', list.get());
    };

    scope.save = function () {
        let val = $elm.find('input[name=page]').val();
        let arr = val.split(',');
        let id = $.trim(arr[1]);
        let name = arr[0];
        let d = arr[2] || 1;
        if (!id || !name) return alert('请填写id和name.');
        if (list.find(id).result().length) {
            list.set({name: name, id: id, d: d * 1});
        } else {
            list.add({name: name, id: id, d: d * 1});
        }
        let pages = list.get();
        scope.render('list', {pages: pages});

        chrome_storage.set('stock.pages', pages);
        console.table(list.get());
        $.icMsg('保存成功！');
    }

});


brick.reg('clsCtrl', function () {
    let scope = this;

    function f (dob) {
        scope.render('cls', dob);
    }

    chrome_storage.get('cls', f);

    scope.set_cls = function () {
        let $th = $(this);
        chrome_storage.set($th.attr('name'), $th.prop('checked'), function () {
            chrome_tabs.reload('https://www.cailianpress.com/*');
        });
    };

});


brick.reg('downloadCtrl', function () {
    let scope = this;

    scope.download = function () {
        chrome_tabs.inject(['dist/runtime.js', 'dist/vendors.js', 'dist/common.js', 'dist/content_scripts/js/download-img.js']);
        $(this).text('start');
        setTimeout(() => {
            window.close();
        }, 1000);
    }

});


brick.reg('otherCtrl', function (scope) {

    scope.speak = function () {
        chrome_tabs.inject(['dist/runtime.js', 'dist/vendors.js', 'dist/common.js', 'dist/content_scripts/js/speak.js']);
        //$(this).text('start');
        $.icMsg('已经开启');
        setTimeout(() => {
            window.close();
        }, 1000);
    };



    // ====================================================
    let contextMenuKey = `isEnableContextMenu.${ urlKey }`;

    chrome_storage.get(contextMenuKey, function (val) {
        if(val === undefined) return;
        $('#toggleContextMenu').prop('checked', !!val);
    });

    scope.toggleContextMenu = function (e) {
        let val = $(this).prop('checked');
        $.icMsg(val + ' ');
        chrome_storage.set(contextMenuKey, val);
        //发消息给content scripts, 启用或禁用右键菜单
        chrome.tabs.sendRequest(tabId, {
            name: 'isEnableContextMenu',
            isEnableContextMenu: val
        }, function (response) {
            console.log(response);
        });
    };


});


brick.reg('setNoteTagCtrl', function (scope) {

    let key = '';
    let $input = scope.$elm.find('[name=logicTag]');


        key = `noteTag.${ urlKey }`;

        chrome_storage.get(key, function (val) {
            if (val) {
                $input.val(val)
            }
        });


        scope.setLogicTag = function (e) {
            let val = $input.val();
            if (val.trim() !== '') {
                val && chrome_storage.set(key, val);
                $.icMsg(`已经设定${ key } ：${ val }`);

                //发消息给content scripts, 启用或禁用右键菜单
                chrome.tabs.sendRequest(tabId, {
                    name: 'setNoteTag',
                    noteTag: val
                }, function (response) {
                    console.log(response);
                });


            }
        }

});
