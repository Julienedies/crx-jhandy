/**
 * Created by j on 18/5/13.
 */


$(function(){

    $('<div style="position: fixed; top:0;left:0;background: green;color:#ffffff;padding:5px 10px;z-index: 10000;">全部展开</div>').appendTo(document.body).on('click', function(){
        $('a.moreText').click();
        console.log(1);
        $('a.moreText').each(function(){
            var $th = $(this);
            if($th.text().match('展开')){
                $th.click();
            }
        });

    });



/*
    var callback = function(){

        setTimeout(function(){
            $('#showPerpage').val('50');
            $('a.moreText').each(function(){
                var $th = $(this);
                //var $span = $th.next();
                //$span.text($span.attr('fullstr'));
                if($th.text().match('展开')){
                    setTimeout(function(){
                        $th.click();
                    },100);
                }
            });
        }, 500);

    };

    callback();

    var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

    var MutationObserverConfig = {
        childList: true,
        subtree: true,
        characterData: true
    };

    var observer = new MutationObserver(function (mutations) {

        //callback();

    });



    observer.observe(document.body, MutationObserverConfig);
*/




});





