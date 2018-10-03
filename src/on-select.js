/*!
 * Created by j on 18/9/19.
 */

;
(function () {
    var cm = {
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

            //
            $elm.on('click', '[todo=mark_stock_link]', function (e) {
                chrome.runtime.sendMessage({todo: 'get_global'}, function(response){
                    let code = response.code;
                    $.ajax({
                        url:`http://localhost:2018/stock/c/${code}`,
                        type:'post',
                        data:{
                            "链接":location.href
                        }
                    }).done(function(msg){
                        chrome.runtime.sendMessage({todo: 'notify',duration: 4, title: '', msg: '个股链接标记 OK!'});
                    }).fail(function(err){
                        console.error(err);
                        alert('个股链接标记出错.');
                    });
                });
            });
            //
            $elm.on('click', '[todo=view_in_tdx]', function (e) {
                chrome.runtime.sendMessage({event: 'view_in_tdx', code: that.query});
            });
            //
            $elm.on('click', '[todo=mark_news]', function (e) {
                $.ajax({
                    url: 'http://localhost:2018/stock/news',
                    type: 'post',
                    data: {text: that.query, date: (new Date).toLocaleDateString()}
                }).fail(function (err) {
                        console.error(err);
                        alert('财经资讯标记出错.');
                    }
                ).done(function(msg){
                        chrome.runtime.sendMessage({todo: 'notify',duration: 4, title: '', msg: '资讯标记 OK!'});
                    });
            });
            //
            $elm.on('click', '[data-url]', function (e) {
                let url = this.dataset.url;
                url = url.replace('*', encodeURIComponent(that.query));
                window.open(url);
            });
            //
            $elm.on('click', '[todo=back_top]', function (e) {
                $('body,html').scrollTop(0); //animate({scrollTop:0},100);
            });
            //
            $elm.on('click', (e) => {
                setTimeout(()=> {
                    cm.hide();
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
                cm.hide();
            }, 10 * 1000);
        },
        hide: function () {
            this.$elm.hide();
            this.query = '';
            cm.is_show = false;
        },
        init: function () {
            this.create_$elm();
            this.width = this.$elm.width();
            this.height = this.$elm.height();
            $(document).on('mouseup', function (e) {
                var query = window.getSelection().toString();
                console.log(query, e);
                if (!query) return cm.hide();
                if (query == cm.query && cm.is_show) return;
                document.execCommand('copy');
                cm.render('on_select_view');
                cm.show(query, e.clientX, e.clientY);
            }).on('contextmenu', function(e){
                //cm.render('oncontextmenu_view');
                //cm.show('', e.clientX, e.clientY, -150);
            });
        }
    };

    cm.init();

})();
