/*!
 * Created by j on 18/9/19.
 */

;
(function () {

    const contextMenu = {
        is_show: false,
        query: '',
        $elm: null,
        width: 0,
        height: 0,
        oncontextmenu_view: __inline('oncontextmenu.html'),
        on_select_view: __inline('on-select.html'),
        render:function(view_name){
            this.$elm.html(this[view_name]);
        },
        create_$elm: function () {
            let that = this;
            let $elm = this.$elm = $('<div id="crx_jhandy_oncontextmenu"></div>').appendTo(document.body);

            // 交易逻辑记录
            $elm.on('click', '[todo=mark_stock_logic]', function (e) {
                $.ajax({
                    url: 'http://localhost:2018/stock/logic',
                    type: 'post',
                    data: {text: that.query, type:''}
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
                    url: 'http://localhost:2018/note',
                    type: 'post',
                    data: {text: that.query, type:''}
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
                chrome.runtime.sendMessage({todo: 'get_global'}, function(response){
                    let code = response.code;
                    if(!code){
                        console.error(response);
                        return alert('没有code.');
                    }
                    $.ajax({
                        url:`http://localhost:2018/stock/c/${code}`,
                        type:'post',
                        data:{
                            "链接":location.href
                        }
                    }).done(function(msg){
                        let name = msg['名称'];
                        chrome.runtime.sendMessage({todo: 'notify',duration: 4, title: '', msg: `${name} 链接标记 OK!`});
                    }).fail(function(err){
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
                    url: 'http://localhost:2018/stock/news',
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
                setTimeout(()=> {
                    contextMenu.hide();
                }, 100);
                return false;
            });
        },
        set_position: function (x, y, offset) {
            offset = offset || 15;
            var $win = $(window);
            var $elm = this.$elm;
            var w = $elm.width();
            var h = $elm.height();
            var vw = $win.width();
            var vh = $win.height();
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
            this.set_position(x, y,  offset);
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
                if (query == contextMenu.query && contextMenu.is_show) return;
                document.execCommand('copy');
                contextMenu.render('on_select_view');
                contextMenu.show(query, e.clientX, e.clientY);
            }).on('contextmenu', function(e){
                //cm.render('oncontextmenu_view');
                //cm.show('', e.clientX, e.clientY, -150);
            });
        }
    };

    contextMenu.init();

})();
