/*!
 * Created by j on 18/9/19.
 */

;
(function () {

    const shandyHost = 'http://localhost:3300'

    const contextMenu = {
        is_show: false,
        query: '',
        $elm: null,
        width: 0,
        height: 0,
        oncontextmenu_view: "<div>\n\n    <section>\n        <button todo=\"mark_stock_link\">个股链接标记</button>\n    </section>\n\n</div>",
        on_select_view: "<div>\n\n    <!--<a class=\"close_btn\">x</a>-->\n\n    <section>\n        <button todo=\"search\" data-url=\"https://www.google.com/search?q=*\">google</button>\n        <button todo=\"search\" data-url=\"https://www.baidu.com/s?ie=UTF-8&wd=*\">百度</button>\n        <button todo=\"search\" data-url=\"http://www.bing.com/search?q=*\">Bing</button>\n        <button todo=\"search\" data-url=\"https://www.sogou.com/web?query=*\">搜狗</button>\n        <button todo=\"search\" data-url=\"https://www.douban.com/search?q=*\">豆瓣</button>\n        <button todo=\"search\" data-url=\"http://www.xiami.com/search?key=*&pos=1\">虾米</button>\n        <button todo=\"search\" data-url=\"https://www.zhihu.com/search?type=content&q=*\">知乎</button>\n    </section>\n\n    <section>\n        <button todo=\"view_in_tdx\">通达信查看</button>\n        <button todo=\"mark_news\">资讯标记</button>\n        <button todo=\"mark_stock_logic\">交易逻辑标记</button>\n        <button todo=\"mark_stock_link\">个股链接标记</button>\n        <button todo=\"mark_note\">笔记标记</button>\n        <button data-url=\"https://www.iwencai.com/data-robot/extract-new?qs=pc_~soniu~others~resultpage~datarobot~input&w=*&querytype=stock&dataSource=send_click\">同花顺问财</button>\n        <button todo=\"search\" data-url=\"http://basic.10jqka.com.cn/*/company.html\">同花顺</button>\n    </section>\n\n    <section>\n\n    </section>\n\n    <section>\n\n    </section>\n\n    <section>\n        <button todo=\"fy\" data-url=\"http://fanyi.baidu.com/#en/zh/*\">翻译</button>\n        <button todo=\"search\" data-url=\"http://dict.youdao.com/w/eng/*\">有道</button>\n        <button todo=\"search\" data-url=\"https://www.npmjs.com/package/*\">npm</button>\n        <button todo=\"search\" data-url=\"https://github.com/search?q=*\">git</button>\n        <button todo=\"search\" data-url=\"http://www.btbtdy.net/search/*.html\">BT</button>\n        <button todo=\"search\" data-url=\"http://www.btbaocai.cc/search/*\">bt</button>\n        <button todo=\"search\" data-url=\"https://m.zhongzimei.com/list/*/1\">bt2</button>\n        <button todo=\"search\" data-url=\"https://zh.wikipedia.org/wiki/*\">维基</button>\n        <button todo=\"back_top\">back top</button>\n    </section>\n\n    <section>\n\n\n    </section>\n\n</div>",
        render: function (view_name) {
            this.$elm.html(this[view_name]);
        },
        create_$elm: function () {
            let that = this;
            let $elm = this.$elm = $('<div id="crx_jhandy_oncontextmenu"></div>').appendTo(document.body);

            // 交易逻辑记录
            $elm.on('click', '[todo=mark_stock_logic]', function (e) {
                $.ajax({
                    url: `${ shandyHost }/stock/logic`,
                    type: 'post',
                    data: {text: that.query, type: ''}
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
                            "链接": location.href
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
            }, 10 * 1000);
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
                let query = window.getSelection().toString();
                if (!query) return contextMenu.hide();
                if (query === contextMenu.query && contextMenu.is_show) return;
                document.execCommand('copy');
                contextMenu.render('on_select_view');
                contextMenu.show(query, e.clientX, e.clientY);
            }).on('contextmenu', function (e) {
                //cm.render('oncontextmenu_view');
                //cm.show('', e.clientX, e.clientY, -150);
            });
        }
    };

    contextMenu.init();

})();
