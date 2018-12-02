/**
 * Created by j on 18/6/26.
 */

console.log('I am download-img.js');

var title = $('title').text() || +new Date;

var $imgs = $('img[src*=jpg],img[src*=png]');


var $c = $('<div style="position: fixed; top:0; left:0; bottom:0;right:0; background:rgba(0,0,0,0.7); padding:10px 160px 10px 10px; z-index:10000; overflow: scroll;"></div>');

var $close_btn = $('<div style="position: absolute;padding:5px 15px;border:solid 1px #000000;top:0;right:0;font-size:3em;color:white;cursor: pointer;">X</div>').click(()=>$c.hide()).appendTo($c);

var $donwload_btn = $('<div style="position: absolute;padding: 7px;border:solid 1px #000000;top:120px;right:0;font-size:2.4em;color:white;cursor: pointer;">下载</div>').appendTo($c).click(function(){
    $(this).text('下载中');
    var urls = [];
    $box.find('img').each(function(){
        urls.push(this.src);
    });
    chrome.runtime.sendMessage({todo:'download', url:urls, folder:title});
});

var $box = $('<div></div>').appendTo($c);



$imgs.each(function () {
    console.log(this.src, this.width, this.height);
    if(this.width > 300){
        //urls.push(this.src);
        let $clone = $(this).clone();
        $clone.appendTo($box).css({width: '240px', height:'auto',padding: '5px'}).click(function(){
            $(this).remove();
        });
    }
});

$c.appendTo(document.body);