/**
 * Created by j on 18/6/23.
 */

/*let config = {"cls.speak":false,"stock.interval":"10","stock.pages":[{"d":1,"id":"ths_p","name":" 同花顺资料"},{"d":1.5,"id":"ycj","name":"云财经","show":true},{"d":1,"id":"ths_news","name":"同花顺新闻","show":true},{"d":1,"id":"ths_new","name":"同花顺动态","show":true},{"d":1,"id":"ths_c","name":"同花顺概念","show":true},{"d":1.5,"id":"site","name":"个股站点","show":false}],"stock.queue":false,"stock.relation":true};

for(let i in config){
    chrome_storage.set(i, config[i]);
}*/

brick.controllers.reg('mainCtrl', function () {

    let scope = this;

    // 用于子控制器继承
    scope.on_checkbox_changed = function () {
        let $th = $(this);
        chrome_storage.set($th.attr('name'), $th.prop('checked'));
    };
});

brick.controllers.reg('stockCtrl', function () {

    let ListManager = brick.services.get('recordManager');
    let list = window.ll = new ListManager();

    let scope = this;
    let $elm = scope.$elm;

    function f(dob) {
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

    scope.on_page_changed = function(){
        let $th = $(this);
        let id = $th.val();
        let show = $th.prop('checked');
        list.find(id).set({show:show});
        chrome_storage.set('stock.pages', list.get());
    };

    scope.edit = function(){
        let $th = $(this);
        let id = $th.data('id');
        let p = list.get(id)[0];
        console.log(p);
        let arr = [p.name, p.id, p.d, p.show];
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
        let val = $elm.find('input[name=page]').val();
        let arr = val.split(',');
        let id = $.trim(arr[1]);
        let name = arr[0];
        let d = arr[2] || 1;
        if(!id || !name) return alert('请填写id和name.');
        if(list.find(id).result().length){
            list.set({name:name, id: id, d: d*1});
        }else{
            list.add({name:name, id: id, d: d*1});
        }
        let pages = list.get();
        scope.render('list', {pages:pages});

        chrome_storage.set('stock.pages', pages);
        console.table(list.get());
    }

});

brick.controllers.reg('clsCtrl', function () {
    let scope = this;

    function f(dob) {
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

brick.reg('otherCtrl', function(){
    let scope = this;


});

brick.reg('setNoteTagCtrl', function (scope) {

    let key = '';
    let $input = scope.$elm.find('[name=logic_tag]');

    scope.setLogicTag = function(e){
        let val = $input.val();
        val && chrome_storage.set(key, val);
        console.log(key, val);
    }

    chrome.tabs.getSelected(function(tab){

        key = `noteTag.${btoa(tab.url).substr(-17)}`;

        chrome_storage.get(key, function (val) {
            if(val){
                $input.val(val)
            }

        });


    });



});
