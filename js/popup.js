

$('#get_stock_code_list').on('click', function(e){

    //向当前页面注入js
    //window.chrome && chrome.tabs && chrome.tabs.executeScript(null, {file: "js/cs/get-stock-code-list.js"});

});


brick.controllers.reg('get_u_p_ctrl', function(scope){

    var $elm = scope.$elm;

    $elm.on('click', '#get_or_set_u_p', function(e){

        var $u = $elm.find('[name=u]');
        var $p = $elm.find('[name=p]');

        window.chrome && chrome.tabs && chrome.tabs.executeScript(null, {file: "js/cs/get_u_p.js"});

        // 接收content script发过来的消息
        chrome.extension.onRequest.addListener(

            function (request, sender, sendResponse) {
                console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                    "from the extension");
                if (request.greeting == "hello") {
                    sendResponse({farewell: "goodbye"});
                }else {
                    sendResponse({});
                }

                $u.val(request.u);
                $p.val(request.p);
            }
        );

        var val_u = $u.val();
        var val_p = $p.val();

        if(val_u && val_p){

            brick.cache('u')

        }else{



        }


    });



});