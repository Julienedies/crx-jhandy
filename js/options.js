/**
 * Created by j on 18/6/23.
 */


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
    var list = new ListManager();

    var scope = this;
    var $elm = scope.$elm;

    function f(dob) {
        scope.render('stock', dob);
        dob.page_queue && list.init(dob.page_queue);
        console.log(list.get());
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
        var arr = [$th.data('name'), id, $th.data('d'), show];
        $elm.find('textarea[name=page]').val(arr.join(','));
        list.find(id).set({show:show});
        chrome_storage.set('stock.page_queue', list.get());
    };

    scope.up = function(){


    };

    scope.add_page_to_queue = function(){
        var val = $elm.find('textarea[name=page]').val();
        var arr = val.split(',');
        var id = arr[1];
        if(list.find(id).result().length){
            list.set({name:arr[0], id: id, d: arr[2]||1});
        }else{
            list.add({name:arr[0], id: id, d: arr[2]||1});
        }
        chrome_storage.set('stock.page_queue', list.get());
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
            chrome_tabs.query('https://www.cailianpress.com/*', function (tabs) {
                chrome_tabs.reload(tabs);
            });
        });
    };


});



brick.controllers.reg('downloadCtrl', function(){
    let scope = this;


    scope.download = function(){
        chrome_tabs.inject([ 'js/vendor/jquery.min.js', 'js/cs/download-img.js' ]);
        this.text('start');
    }



});