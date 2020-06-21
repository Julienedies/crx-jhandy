/**
 *
 * Created by j on 2019-08-09.
 */

module.exports = {
    /**
     * 生成入口文件列表
     * @param entryArr  {Array}
     * @param [entryMap] {Object}
     * @return  {Object}
     *             {
     *               'app': ['./pages/app/main.js'],
     *               'popup': ['./pages/popup/main.js'],
     *               'background': ['./pages/app/background.js']
     *               }
     *
     */
    createEntryForContentScriptsJs: function (entryArr, entryMap) {
        entryMap = entryMap || {};
        entryArr.map((jsPath) => {
            let arr = jsPath.match(/content_scripts\/js\/(.+)\.js$/i);
            let name = `content_scripts/js/${ arr[1] }`;
            entryMap[name] = [jsPath];
        });
        return entryMap;
    },
    createEntryForContentScriptsCss: function (entryArr, entryMap) {
        entryMap = entryMap || {};
        entryMap['css'] = entryArr;
        return entryMap;
    }
}
