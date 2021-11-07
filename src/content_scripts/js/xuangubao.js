/**
 *
 * Created by j on 2019-08-13.
 */

import $ from 'jquery';

import utils from '../../js/lib/utils'

console.log('I am xuangubao.js.');

// 如果当前页面是选股宝首页，每分钟刷新一次
if (location.href === 'https://xuangubao.cn/') {
    let d = new Date().getHours();
    if (utils.isTradingTime()) {
        console.log('刷新', +new Date);
        setInterval(() => {
            location.reload();
        }, 45 * 1000);
    }

}


/*let $loadmore = $('.home-news-footer-loadmore');

utils.onScrollEnd(() => {
    $loadmore.length && $loadmore[0].click();
});*/
