/**
 * Created by j on 18/3/9.
 */

import $ from 'jquery';

var $99 = $('<div id="99" style="position: fixed;top:0;left:10px;width:200px;height:100%;border:blue;background:white;z-index:100000;"><textarea style="display:block;width:100%;height:100%;"></textarea></div>').appendTo(document.body);

var ss = [];

$('#quotesearch li').each(function(item){
    var t = this.textContent;
    if(/\([063]\d{5}\)$/.test(t)){
        t = t.match(/\(([063]\d{5})\)$/);
        ss.push(t[1]);
    }
});

$99.find('textarea').text('["' + ss.join('","') + '"]');
