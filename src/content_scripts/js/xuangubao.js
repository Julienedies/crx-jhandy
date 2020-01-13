/**
 *
 * Created by j on 2019-08-13.
 */

import $ from 'jquery';

import utils from '../../js/lib/utils'

console.log('I am xuangubao.js.');


let $loadmore = $('.home-news-footer-loadmore');

utils.onScrollEnd(() => {
    $loadmore.length && $loadmore[0].click();
});
