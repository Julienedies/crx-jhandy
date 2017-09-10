/**
 * Created by j on 17/9/10.
 */

var div = document.createElement('div');
div.style.cssText = 'position:fixed;bottom:10px;right:10px;width:30px;height:30px;background-color:rgba(0,0,0,0.4);color:white;text-align:center;line-height:30px;cursor: pointer;';
div.appendChild(document.createTextNode('^'));
div.onclick = function(){
    document.documentElement.scrollTop = document.body.scrollTop = 0;
};
document.body.appendChild(div);