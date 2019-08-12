/**
 *
 * Created by j on 2019-08-10.
 */

import $ from 'jquery';

export default {

    // 是否股市交易时间
    isTradingTime () {
        let d = new Date();
        let z = d.getDay();
        let h = d.getHours();
        return z > 0 && z < 6 && h > 8 && h < 15;
    },

    // 当滚动到页面底部, 执行回调函数
    onScrollEnd (cb) {

        let clientHeight = $(window).height();
        let $doc = $(document);

        $doc.on('scroll', function (e) {
            let scrollTop = $doc.scrollTop();
            console.log(clientHeight, scrollTop, $doc.height());
            if (clientHeight + scrollTop + 170 >= $doc.height()) {
                console.log('滚动到了页面底部');
                cb();
            }
        });
    }
}
