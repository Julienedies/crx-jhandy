/**
 *
 * 注入当前页面的js脚本；
 *
 */


// 接收content script发过来的消息
chrome.extension.onRequest.addListener(function (request, sender, sendResponse) {

    console.log('收到background.js发来的消息', request, sender);
    call(request.id);

});


//
function call(id) {

    var each = {

        '33': function each33(i) {

            var red = [];

            var row = $(this);
            var cells = row.find('td');
            var num = cells.eq(1).text() * 1;

            cells.filter('.z_font_red').each(function (i) {
                red.push($(this).text() * 1);
            });


            var blue = cells.filter('.z_font_ls').text() * 1;

            var dobj = {num: num, red: red, blue: blue};

            result.push(dobj);

        },
        '15': function each15(i) {

                var row = $(this);
                var cells = row.find('td');
                var num = cells.eq(1).text() * 1;
                var red = cells.eq(2).text().split(' ');

                red.forEach(function (v, i, arr) {
                    arr[i] = v * 1;
                });

                result.push({num: num, red: red});
            }
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
        alert('err');
    }).done(function (data) {
        console.log(data);
    });


}





