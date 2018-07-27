/**
 * Created by j on 18/6/23.
 */

/*var config = {"cls.speak":false,"stock.interval":"10","stock.pages":[{"d":1,"id":"ths_p","name":" 同花顺资料"},{"d":1.5,"id":"ycj","name":"云财经","show":true},{"d":1,"id":"ths_news","name":"同花顺新闻","show":true},{"d":1,"id":"ths_new","name":"同花顺动态","show":true},{"d":1,"id":"ths_c","name":"同花顺概念","show":true},{"d":1.5,"id":"site","name":"个股站点","show":false}],"stock.queue":false,"stock.relation":true};

for(let i in config){
    chrome_storage.set(i, config[i]);
}*/

brick.controllers.reg('mainCtrl', function () {

    var scope = this;

    // 用于子控制器继承
    scope.on_checkbox_changed = function () {
        var $th = $(this);
        chrome_storage.set($th.attr('name'), $th.prop('checked'));
    };
});


brick.controllers.reg('stockCtrl', function () {

    var ListManager = brick.services.get('recordManager');
    var list = window.ll = new ListManager();

    var scope = this;
    var $elm = scope.$elm;

    function f(dob) {
        console.log(dob);
        scope.render('stock', dob);
        dob.pages && list.init(dob.pages);
        //console.table(list.get());
    }

    chrome_storage.get('stock', f);

    scope.set_interval = function () {
        var val = $elm.find('input[name=interval]').val() || 30;
        $elm.find('#show_interval').text(val);
        chrome_storage.set('stock.interval', val);
    };

    scope.on_page_changed = function(){
        var $th = $(this);
        var id = $th.val();
        var show = $th.prop('checked');
        list.find(id).set({show:show});
        chrome_storage.set('stock.pages', list.get());
    };

    scope.edit = function(){
        var $th = $(this);
        var id = $th.data('id');
        var p = list.get(id)[0];
        console.log(p);
        var arr = [p.name, p.id, p.d, p.show];
        $elm.find('input[name=page]').val(arr.join(','));
    };

    scope.up = function(){
        let $th = $(this);
        let id = $th.data('id');
        let s = `#page_${id}`;
        let $item = $th.closest(s);
        $item.insertBefore($item.prev());
        let item = list.find(id).prev();
        //console.table(list.get());
        chrome_storage.set('stock.pages', list.get());
    };

    scope.save = function(){
        var val = $elm.find('input[name=page]').val();
        var arr = val.split(',');
        var id = $.trim(arr[1]);
        var name = arr[0];
        var d = arr[2] || 1;
        if(!id || !name) return alert('请填写id和name.');
        if(list.find(id).result().length){
            list.set({name:name, id: id, d: d*1});
        }else{
            list.add({name:name, id: id, d: d*1});
        }
        var pages = list.get();
        scope.render('list', {pages:pages});

        chrome_storage.set('stock.pages', pages);
        console.table(list.get());
    }

});


brick.controllers.reg('clsCtrl', function () {
    var scope = this;

    function f(dob) {
        scope.render('cls', dob);
    }

    chrome_storage.get('cls', f);

    scope.set_speak = function () {
        var $th = $(this);
        chrome_storage.set($th.attr('name'), $th.prop('checked'), function () {
            chrome_tabs.reload('https://www.cailianpress.com/*');
        });
    };


});


brick.controllers.reg('downloadCtrl', function(){
    let scope = this;

    scope.download = function(){
        chrome_tabs.inject([ 'js/vendor/jquery.min.js', 'js/cs/download-img.js' ]);
        $(this).text('start');
        setTimeout(()=>{
            window.close();
        },1000);
    }


});