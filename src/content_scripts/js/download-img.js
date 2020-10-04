/**
 * Created by j on 18/6/26.
 */

import $ from 'jquery';

console.log('I am download-img.js');

const C = 'jhandy_download_img_c';
const BOX = 'jhandy_download_img_box';

let $c = $(`#${ C }`);
let $box = $(`#${ BOX }`);
let $closeBtn;
let $downloadBtn;

let title = $('title').text() || +new Date;
let $images;

if ($c.length > 0) {
    $c.show();
    $box.empty();
} else {
    $c = $(`<div id="${ C }" style="position: fixed; top:0; left:0; bottom:0;right:0; background:rgba(0,0,0,0.7); padding:10px 160px 10px 10px; z-index:10000; overflow: scroll;"></div>`);

    $box = $(`<div id="${ BOX }"></div>`).appendTo($c);

    $closeBtn = $('<div style="position: absolute;padding:5px 15px;border:solid 1px #000000;top:0;right:0;font-size:3em;color:white;cursor: pointer;">X</div>')
        .appendTo($c)
        .click(() => $c.hide());

    $downloadBtn = $('<div style="position: absolute;padding: 7px;border:solid 1px #000000;top:120px;right:0;font-size:2.4em;color:white;cursor: pointer;">下载</div>')
        .appendTo($c)
        .click(function () {
            $(this).text('下载中');
            let urls = [];
            $box.find('img').each(function () {
                urls.push(this.src);
            });
            chrome.runtime.sendMessage({todo: 'download', url: urls, folder: title});
        });

    $c.appendTo(document.body);
}


$images = $('img[src*=jpg],img[src*=png]');
$images.each(function () {
    //console.log(this.src, this.width, this.height);
    if (this.width > 300) {
        //urls.push(this.src);
        let $clone = $(this).clone();
        $clone.appendTo($box).css({width: '240px', height: 'auto', padding: '5px'}).click(function () {
            $(this).remove();
        });
    }
});

console.log('***************', $images.length);



