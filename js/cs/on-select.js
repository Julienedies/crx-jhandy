/*!
 * Created by j on 18/9/19.
 */

;
(function () {
    var cm = {
        is_show: false,
        query: '',
        $elm: null,
        create_$elm: function () {
            let that = this;
            let html = "<div id=\"crx_jhandy_on_select\">\n    <section>\n        <button todo=\"search\" data-url=\"https://www.google.com/search?q=TESTSEARCH\">google</button>\n        <button todo=\"search\" data-url=\"https://www.baidu.com/s?ie=UTF-8&wd=TESTSEARCH\">百度</button>\n        <button todo=\"search\" data-url=\"http://www.bing.com/search?q=TESTSEARCH\">Bing</button>\n        <button todo=\"search\" data-url=\"https://www.sogou.com/web?query=TESTSEARCH\">搜狗</button>\n    </section>\n\n    <section>\n        <button todo=\"view_in_tdx\">通达信查看</button>\n        <button data-url=\"https://www.iwencai.com/data-robot/extract-new?qs=pc_~soniu~others~resultpage~datarobot~input&w=TESTSEARCH&querytype=stock&dataSource=send_click\">同花顺问财</button>\n        <button todo=\"search\" data-url=\"http://basic.10jqka.com.cn/TESTSEARCH/company.html\">同花顺</button>\n    </section>\n\n    <section>\n        <button todo=\"search\" data-url=\"https://www.douban.com/search?q=TESTSEARCH\">豆瓣</button>\n        <button todo=\"search\" data-url=\"http://www.xiami.com/search?key=TESTSEARCH&pos=1\">虾米</button>\n        <button todo=\"search\" data-url=\"https://www.zhihu.com/search?type=content&q=TESTSEARCH\">知乎</button>\n    </section>\n\n    <section>\n        <button todo=\"fy\" data-url=\"http://fanyi.baidu.com/#en/zh/TESTSEARCH\">翻译</button>\n        <button todo=\"search\" data-url=\"http://dict.youdao.com/w/eng/TESTSEARCH\">有道</button>\n        <button todo=\"search\" data-url=\"http://www.btbtdy.com/search/TESTSEARCH.html\">BT</button>\n        <button todo=\"search\" data-url=\"https://zh.wikipedia.org/wiki/TESTSEARCH\">维基</button>\n    </section>\n\n</div>";
            let $elm = this.$elm = $(html).appendTo(document.body);

            $elm.on('click', '[todo=view_in_tdx]', function (e) {
                chrome.runtime.sendMessage({event: 'view_in_tdx', code: that.query});
            });

            $elm.on('click', '[data-url]', function (e) {
                let url = this.dataset.url;
                url = url.replace('TESTSEARCH', encodeURIComponent(that.query));
                window.open(url);
            });

            $elm.on('click', (e) => {
                console.log(e);
                setTimeout(()=> {
                    cm.hide();
                }, 100);
            });
        },
        show: function (query, x, y) {
            //$(document).off('mouseup', this.on_select);
            this.is_show = true;
            this.query = query;
            this.$elm.css({'left': x + 15, 'top': y + 15}).show();
            setTimeout(function () {
                cm.hide();
            }, 100000 * 1000);
        },
        hide: function () {
            this.$elm.hide();
            this.query = '';
            cm.is_show = false;
        },
        init: function () {
            this.create_$elm();
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
