/**
 * Created by j on 18/5/7.
 * for 云财经页面
 */

import $ from 'jquery';

let code = location.href.match(/\d{6}(?=\.html)/)[0];

let url = 'http://basic.10jqka.com.cn/*/'.replace('*', code);

$('#qingbao-page .stock-tab').append(`<a href="${ url }" target="_blank">同花顺</a>`);

