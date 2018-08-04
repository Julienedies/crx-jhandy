/**
 * Created by j on 18/5/13.
 */

$(function(){
    //
    setTimeout(function(){
        $('a.num.current').removeClass('current')[0].click();
    }, 3000);

    //
    $('<div style="position: fixed; top:0;right:0;background: black;color:#ffffff;padding:5px 10px;z-index: 10000;">全部展开</div>').appendTo(document.body).on('click', function(){
        $('a.moreText').each(function(){
            this.click();
        });
    });

    //

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









