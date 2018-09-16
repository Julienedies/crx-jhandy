/*!
 * Created by j on 18/9/15.
 * chrome content script
 */

var arr = location.href.match(/\?close=(\d+)$/i) || [];
var q = arr[0];
var d = arr[1];

if (d) {
    chrome.runtime.sendMessage({
        todo: 'close_tab',
        event: 'close_tab',
        delay: d,
        url: location.href
    });
}

var pop = {
    query:'',
    $elm:null,
    create_$elm: function(){
        let that = this;
       let $elm = this.$elm =
           $('<div style="position:fixed;z-index: 10001;background:rgba(0,0,0,0.7);padding:5px 10px;color:#fff;">' +
           '<button todo="view_in_tdx">通达信查看</button>' +
           '<button todo="fy">翻译</button>' +
           '<button todo="search">搜索</button>' +
           '</div>')
               .appendTo(document.body);

        $elm.on('blur', function(e){
            $elm.hide();
        });
        $elm.on('click', '[todo=view_in_tdx]', function(e){
            chrome.runtime.sendMessage({event: 'view_in_tdx', code: that.query});
            return false;
        });
        return $elm;
    },
    show:function(query, x, y){
        if(!query) return;
        this.query = query;
        let $elm = this.$elm || this.create_$elm();
        $elm.css({'left':x+10+'px', 'top':y+10}).show().focus();
        setTimeout(function(){
            $elm.hide();
        }, 5 * 1000)
    }
};

/*$(document).on('mouseup', function(e){
   var s = window.getSelection().toString();
    console.log(e);
    pop.show(s, e.clientX, e.clientY);
});*/
