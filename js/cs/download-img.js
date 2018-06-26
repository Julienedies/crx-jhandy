/**
 * Created by j on 18/6/26.
 */

console.log('I am download-img.js');

var title = $('title').text() || +new Date;

var $imgs = $('img[src*=jpg]');


var $c = $('<div style="position: fixed; top:0; left:0; width:100%; height: 100%; background:rgba(0,0,0,0.5); padding:10px 160px 10px 10px; z-index:10000; overflow: scroll;"></div>');

var $close_btn = $('<div style="position: absolute;padding: 7px;border:solid 1px #000000;top:0;right:0;font-size:3em;color:white;cursor: pointer;">X</div>').click(()=>$c.hide()).appendTo($c);

var $donwload_btn = $('<div style="position: absolute;padding: 7px;border:solid 1px #000000;top:120px;right:0;font-size:3em;color:white;cursor: pointer;">下载</div>').appendTo($c).click(function(){
    chrome.runtime.sendMessage({todo:'download', url:urls, folder:title});
});

var $box = $('<div></div>').appendTo($c);


var urls = [];
$imgs.each(function () {
    console.log(this.src, this.width, this.height);
    if(this.width > 400){
        urls.push(this.src);
        $(this).clone().appendTo($box).css({width: '160px', padding: '5px'});
    }
});

$c.appendTo(document.body);