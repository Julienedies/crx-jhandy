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
            let html = __inline('on-select.html');
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
