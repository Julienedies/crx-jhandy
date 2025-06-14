/**
 *
 * Created by j on 2019-08-10.
 */

import $ from 'jquery';


export default {
    /**
     *  日期格式化， 返回当前日期格式化字符串：yyyy-mm-dd
     * @returns {string}
     */
    formatDate () {
        let d = new Date;
        return d.toLocaleDateString().split('/').map((v) => {
            return v.length > 1 ? v : '0' + v;
        }).join('-');
    },

    /**
     * 判断当前是否是A股交易时间
     * @returns {boolean|boolean}
     */
    isTradingTime () {
        let now = new Date();
        let d = now.getDay();
        let h = now.getHours();
        let m = now.getMinutes();

        let isWorkDay = d > 0 && d < 6; // 工作日，周一到周五
        let isOpenMarket = (h >= 8 && h < 12) || (h === 11 && m < 35) || (h >= 13 && h < 15); // 开盘交易时间

        return isWorkDay && isOpenMarket;
    },

    /**
     * 从url里从后截取17个字符，用btoa生成一个key
     * @param [url] {string} 要编码的url
     * @returns {string}
     */
    createUrlKey (url) {
        return btoa(url || location.href).substr(-17);
    },

    /**
     * 当滚动到页面底部, 执行回调函数
     * @param cb {function} 回调函数
     */
    onScrollEnd (cb) {
        let clientHeight = $(window).height();
        let $doc = $(document);

        $doc.on('scroll', function (e) {
            let scrollTop = $doc.scrollTop();
            //console.log(clientHeight, scrollTop, $doc.height());
            if (clientHeight + scrollTop + 170 >= $doc.height()) {
                console.log('滚动到了页面底部');
                cb();
            }
        });
    }


}
