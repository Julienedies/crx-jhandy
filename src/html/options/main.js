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


// chrome_storage.get(function (dob) {
//     console.log(JSON.stringify(dob));
// });

let CURRENT_URL = '';
let urlKey = '';
let tabId;

console.log(CURRENT_URL);

brick.set('bootstrap.auto', false);

chrome.tabs.getSelected(function (tab) {
    tabId = tab.id;
    CURRENT_URL = tab.url;
    urlKey = utils.createUrlKey(CURRENT_URL);
    brick.bootstrap();
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
        chrome_storage.set(name, checked, (...args) => {
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
    let contextMenuKey = `isEnableContextMenu.${ CURRENT_URL }`;

    chrome_storage.get(contextMenuKey, function (val) {
        if (val === undefined) return;
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

            //发消息给content scripts, 更新noteTag
            chrome.tabs.sendRequest(tabId, {
                name: 'setNoteTag',
                noteTag: val
            }, function (response) {
                console.log(response);
            });


        }
    }

});


brick.reg('setPsCtrl', function (scope) {
    let key = CURRENT_URL.split('/')[2].replaceAll('.', '_');
    let $name = scope.$elm.find('[name=nameForPs]');
    let $ps = scope.$elm.find('[name=psForPs]');

    key = `ps_${ key }`;

    chrome_storage.get(key, function (val) {
        if (val) {
            let arr = val.split('#');
            $name.val(arr[0]);
            $ps.val(arr[1]);
        }
    });


    scope.setPs = function (e) {
        let name = $name.val() || '';
        let ps = $ps.val();
        if (ps.trim() !== '') {
            let val = `${ name }#${ ps }`;
            chrome_storage.set(key, val);
            $.icMsg(`已经设定${ key } ：${ ps }`);
        }
    }
});
