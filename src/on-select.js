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
        create_$elm: function () {

            let that = this;
            let html = __inline('on-select.html');
            let $elm = this.$elm = $(html).appendTo(document.body);

            $elm.on('click', '[todo=view_in_tdx]', function (e) {
                chrome.runtime.sendMessage({event: 'view_in_tdx', code: that.query});
            });

            $elm.on('click', '[todo=mark_news]', function (e) {
                $.ajax({
                    url: 'http://localhost:2018/stock/news',
                    type: 'post',
                    data: {text: that.query, date: (new Date).toLocaleDateString()}
                }).fail(function (err) {
                        console.error(err);
                        alert('财经资讯标记出错.');
                    }
                );
            });

            $elm.on('click', '[data-url]', function (e) {
                let url = this.dataset.url;
                url = url.replace('*', encodeURIComponent(that.query));
                window.open(url);
            });

            $elm.on('click', (e) => {
                console.log(e);
                setTimeout(()=> {
                    cm.hide();
                }, 100);
            });
        },
        set_position: function (x, y) {
            var offset = 15;
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
            this.$elm.css({'left': x + 15, 'top': y + 15}).show();
        },
        show: function (query, x, y) {
            this.is_show = true;
            this.query = query;
            this.set_position(x, y);
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
                cm.show(query, e.clientX, e.clientY);
            });
        }
    };

    cm.init();

})();
