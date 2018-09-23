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
            let html = "<div id=\"crx_jhandy_on_select\">\n    <section>\n        <button todo=\"search\" data-url=\"https://www.google.com/search?q=*\">google</button>\n        <button todo=\"search\" data-url=\"https://www.baidu.com/s?ie=UTF-8&wd=*\">百度</button>\n        <button todo=\"search\" data-url=\"http://www.bing.com/search?q=*\">Bing</button>\n        <button todo=\"search\" data-url=\"https://www.sogou.com/web?query=*\">搜狗</button>\n    </section>\n\n    <section>\n        <button todo=\"view_in_tdx\">通达信查看</button>\n        <button todo=\"mark_news\">资讯标记</button>\n        <button data-url=\"https://www.iwencai.com/data-robot/extract-new?qs=pc_~soniu~others~resultpage~datarobot~input&w=*&querytype=stock&dataSource=send_click\">同花顺问财</button>\n        <button todo=\"search\" data-url=\"http://basic.10jqka.com.cn/*/company.html\">同花顺</button>\n    </section>\n\n    <section>\n        <button todo=\"search\" data-url=\"https://www.douban.com/search?q=*\">豆瓣</button>\n        <button todo=\"search\" data-url=\"http://www.xiami.com/search?key=*&pos=1\">虾米</button>\n        <button todo=\"search\" data-url=\"https://www.zhihu.com/search?type=content&q=*\">知乎</button>\n    </section>\n\n    <section>\n        <button todo=\"fy\" data-url=\"http://fanyi.baidu.com/#en/zh/*\">翻译</button>\n        <button todo=\"search\" data-url=\"http://dict.youdao.com/w/eng/*\">有道</button>\n        <button todo=\"search\" data-url=\"https://www.btrabbit.la/search/*.html\">BT</button>\n        <button todo=\"search\" data-url=\"https://zh.wikipedia.org/wiki/*\">维基</button>\n    </section>\n\n</div>";
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
                cm.show(query, e.clientX, e.clientY);
            });
        }
    };

    cm.init();

})();
