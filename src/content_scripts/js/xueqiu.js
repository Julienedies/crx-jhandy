/**
 * Created by j on 18/4/26.
 */

import $ from 'jquery';

//接收同花顺页面发来的个股code
function on_message_callback(message, sender, sendResponse) {
    console.log(message);
    let code = message.code;
    if (code) {
        code = /^6/.test(code) ? 'sh' + code : 'sz' + code;
        let _href = location.href.replace(/[sS][hHzZ]\d{6}/, code);
        if(_href !==location.href) {
            location.href = _href;
        }
    }
}

//接收同花顺页面发来的个股code
chrome.runtime.onMessage.addListener(on_message_callback);


window.location_search = {};
location.search.replace(/^[?&]?([^=]+)=([^&]+)/img,function(input,k,v){
    window.location_search = window.location_search || {};
    console.log(k, v);
    location_search[k] = v;
});

let delay = location_search.delay || 5;
//console.log(delay);

setTimeout(function(){
    //
    document.documentElement.scrollTop = 28;
    //
    let $chart = $('.chart-container');

/*    setTimeout(function(){
        $chart.find('#fullsize').click(); //全屏
        $chart.find('[data-period="day"]').click(); //日K
        setTimeout(function(){
            $chart.find('#slice').click();  //实体K线
        },300);
    },  delay * 1000);*/


    //
    let f = function(){
        $('table.quote-info td').each(function(){
            let $th = $(this);
            let text = $th.text();
            if(/(成交额)|(换手)|(流通值)/img.test(text)){
                $th.css({
                    background:'#06c',
                    color:'white'
                });
            }
        });
    };
    f();
    setInterval(f, 5000);

    //
    setTimeout(function(){
        let $widgets = $('.float-right.stock__side .stock-widget');
        let $widget_1 = $widgets.eq(1);

        $widgets.each(function(index){
            let $th = $(this);
            let title = $th.find('.widget-header .title').text();
            if(title.match('行业：')){
                $th.insertAfter($widget_1);
            }else if(title.match('大家还关注')){
                /*$th.css({
                    position: 'absolute',
                    left: '10px',
                    top: '80px',
                    width: '240px',
                    padding: '20px 10px',
                    background: 'white'
                }).find('.quote-current').css({
                    'padding-right' : '15px'
                });*/
            }
        });
    }, 500);

}, 1000);
