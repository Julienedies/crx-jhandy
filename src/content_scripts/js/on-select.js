/*!
 * Created by j on 18/9/19.
 */


import $ from 'jquery';

import { chrome_storage, chrome_tabs } from '../../js/lib/chromeApi';
import utils from '../../js/lib/utils';

import onSelectHtml from './on-select.html';

console.log('I am on-select.js.');

const shandyHost = 'http://localhost:3300';
const $doc = $(document);

let urlKey = utils.createUrlKey();
let noteTag = '';
let isEnableContextMenu = true;

chrome_storage.get(`noteTag.${ urlKey }`, function (val) {
    noteTag = val;
});

chrome_storage.get(`isEnableContextMenu.${ urlKey }`, function (val) {
    isEnableContextMenu = val;
    console.log('isEnableContextMenu', val);
});

function cancelContextmenu (e) {
    console.log('on click and scroll to hide contextMenu');
    contextMenu.is_show && contextMenu.hide();
    $doc.off('', cancelContextmenu);
}

const contextMenu = {
    is_show: false,
    query: '',
    $elm: null,
    width: 0,
    height: 0,
    on_select_view: onSelectHtml,
    render: function (view_name) {
        this.$elm.html(this[view_name]);
    },
    create_$elm: function () {
        let that = this;
        let $elm = this.$elm = $('<div id="crx_jhandy_oncontextmenu"></div>').appendTo(document.body);

        // 交易逻辑记录
        $elm.on('click', '[todo=mark_stock_logic]', function (e) {
            let text = that.query;
            let tag = '';
            if (noteTag) {
                tag = `${ noteTag }`;
            } else {
                //tag = prompt('添加author:') || '';
                if (tag) {
                    let key = `noteTag.${ btoa(location.href).substr(-17) }`;
                    noteTag = tag;
                    chrome_storage.set(key, noteTag);
                }
                tag = tag && `${ tag }`;
            }

            $.ajax({
                url: `${ shandyHost }/stock/logic`,
                type: 'post',
                data: {text: `${ text }`, type: '', author: tag, source: {url: location.href, title: $('title').text()}}
            }).done(function (msg) {
                chrome.runtime.sendMessage({todo: 'notify', duration: 4, title: '', msg: '交易逻辑标记 OK!'});
            }).fail(function (err) {
                    console.error(err);
                    alert('交易逻辑标记出错.');
                }
            );

        });

        // 笔记标记
        $elm.on('click', '[todo=mark_note]', function (e) {
            $.ajax({
                url: `${ shandyHost }/note`,
                type: 'post',
                data: {text: that.query, type: ''}
            }).done(function (msg) {
                chrome.runtime.sendMessage({todo: 'notify', duration: 4, title: '', msg: '笔记标记 OK!'});
            }).fail(function (err) {
                    console.error(err);
                    alert('笔记标记出错.');
                }
            );
        });

        // 添加股票资料链接
        $elm.on('click', '[todo=mark_stock_link]', function (e) {
            chrome.runtime.sendMessage({todo: 'get_global'}, function (response) {
                let code = response.code;
                if (!code) {
                    console.error(response);
                    return alert('没有code.');
                }
                $.ajax({
                    url: `${ shandyHost }/stock/c/${ code }`,
                    type: 'post',
                    data: {
                        '链接': location.href
                    }
                }).done(function (msg) {
                    let name = msg['名称'];
                    chrome.runtime.sendMessage({todo: 'notify', duration: 4, title: '', msg: `${ name } 链接标记 OK!`});
                }).fail(function (err) {
                    console.error(err);
                    alert('个股链接标记出错.详情查看控制台.');
                });
            });
        });

        // 在通达信中查看该股
        $elm.on('click', '[todo=view_in_tdx]', function (e) {
            chrome.runtime.sendMessage({event: 'view_in_tdx', code: that.query});
        });

        // 财经资讯标记
        $elm.on('click', '[todo=mark_news]', function (e) {
            $.ajax({
                url: `${ shandyHost }/stock/news`,
                type: 'post',
                data: {text: that.query, date: (new Date).toLocaleDateString()}
            }).done(function (msg) {
                chrome.runtime.sendMessage({todo: 'notify', duration: 4, title: '', msg: '资讯标记 OK!'});
            }).fail(function (err) {
                    console.error(err);
                    alert('财经资讯标记出错.');
                }
            );
        });

        // 以选择的文本转到特定url
        $elm.on('click', '[data-url]', function (e) {
            let url = this.dataset.url;
            url = url.replace('*', encodeURIComponent(that.query));
            window.open(url);
        });

        // 滚动到页面顶部
        $elm.on('click', '[todo=back_top]', function (e) {
            $('body,html').scrollTop(0); //animate({scrollTop:0},100);
        });

        //
        $elm.on('click', (e) => {
            setTimeout(() => {
                contextMenu.hide();
                window.getSelection().empty();
            }, 100);
            return false;
        });
    },
    set_position: function (x, y, offset) {
        offset = offset || 15;
        let $win = $(window);
        let $elm = this.$elm;
        let w = $elm.width();
        let h = $elm.height();
        let vw = $win.width();
        let vh = $win.height();
        if (x + w - vw > 0) {
            x = x - w - offset;
        }
        if (y + h - vh > 0) {
            y = y - h - offset;
        }
        this.$elm.css({'left': x + offset, 'top': y + offset}).show();
    },
    show: function (query, x, y, offset) {
        this.is_show = true;
        this.query = query;
        this.set_position(x, y, offset);
        setTimeout(function () {
            contextMenu.hide();
        }, 13 * 1000);
    },
    hide: function () {
        this.$elm.hide();
        this.query = '';
        contextMenu.is_show = false;
    },
    init: function () {
        this.create_$elm();
        this.width = this.$elm.width();
        this.height = this.$elm.height();
        $(document).on('mouseup', function (e) {
            if(isEnableContextMenu===false) return;  // 如果当前页面右键菜单禁用，不做操作
            $doc.off('click scroll contextmenu', cancelContextmenu);
            let selection = window.getSelection();
            if (selection.isCollapsed) return contextMenu.hide();
            let query = window.getSelection().toString().trim();
            query = $.trim(query);
            query = query.replace(/^\s+$/img, '');
            console.log('selection is:', query, query.length, window.getSelection());
            if (!query.length) return contextMenu.hide();
            if (query === contextMenu.query && contextMenu.is_show) return;
            document.execCommand('copy');
            contextMenu.render('on_select_view');
            contextMenu.show(query, e.clientX, e.clientY);
            setTimeout(() => {
                $doc.on('click scroll contextmenu', cancelContextmenu)
            }, 1000)
        }).on('contextmenu', function (e) {
            //cm.render('oncontextmenu_view');
            //cm.show('', e.clientX, e.clientY, -150);
        });
    }
};


contextMenu.init();

// 接收popup发过来的消息，是否开启右键菜单
chrome.extension.onRequest.addListener(
    function (request, sender, sendResponse) {

        //console.info('isEnableContextMenu', request);
        if (request.name === 'isEnableContextMenu') {
            isEnableContextMenu = request.isEnableContextMenu;
/*            if (isEnableContextMenu) {
                contextMenu.$elm.css({opacity: 1, 'pointer-events': 'auto'});
            } else {
                contextMenu.$elm.css({opacity: 0, 'pointer-events': 'none'});
            }*/
        }


        if(request.name === 'setNoteTag') {
            noteTag = request.noteTag;
        }


    }
);

