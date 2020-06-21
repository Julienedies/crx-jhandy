/**
 * Created by j on 17/9/10.
 * ng功能右键菜单响应
 */

//右键菜单调用
function contextMenusCall(id) {

    function each15(i) {

        var row = $(this);
        var cells = row.find('td');
        var num = cells.eq(1).text() * 1;
        var red = cells.eq(2).text().split(' ');

        red.forEach(function (v, i, arr) {
            arr[i] = v * 1;
        });

        red.pop();

        result.push({n: num, r: red});
    }

    function each33(i) {

        var red = [];

        var row = $(this);
        var cells = row.find('td');
        var num = cells.eq(1).text() * 1;

        cells.filter('.z_font_red').each(function (i) {
            red.push($(this).text() * 1);
        });

        var blue = cells.filter('.z_font_ls').eq(0).text() * 1;

        var dobj = {n: num, r: red, b: blue};

        result.push(dobj);

    }

    var each = {
        '35': each33,
        '33': each33,
        '15': each15,
        '30': each15
    };

    /////////////////////////////////////////////////////////

    var result = [];

    var list = $('#info tr');

    list.each(each[id || 33]);

    console.log(JSON.stringify(result));

    $.ajax({
        type: 'post',
        url: id ? 'http://localhost:2017/gather/' + id : 'http://localhost:2014',
        data: JSON.stringify(result),
        contentType: 'application/json'
    }).fail(function (err) {
        alert(err);
    }).done(function (data) {
        alert(data);
    });

}

// 接收contextMenus发过来的消息
chrome.extension.onRequest.addListener(function (request, sender, sendResponse) {

    console.log('收到右键菜单发来的消息', request, sender);
    contextMenusCall(request.id);

});


