/**
 *
 * Created by j on 2022/2/6.
 */

javascript:alert(document.onselectstart = document.onbeforecopy = document.oncontextmenu = document.onmousedown = document.onkeydown = function () {
    return true;
});
void (document.body.onmouseup = "");
void (document.body.onselectstart = "");
void (document.body.onmouseup = "");
void (document.body.oncopy = "");
document.body.contentEditable = 'true';
document.designMode = 'on';
void 0;


document.onselectstart = document.onbeforecopy = document.oncontextmenu = document.onmousedown = document.onkeydown = function () {
    return true;
};
void (document.body.onmouseup = "");
void (document.body.onselectstart = "");
void (document.body.onmouseup = "");
void (document.body.oncopy = "");


(function () {
    function R (a) {
        ona = "on" + a;
        if (window.addEventListener) {
            window.addEventListener(a, function (e) {
                for (var n = e.originalTarget; n; n = n.parentNode) {
                    n[ona] = null;
                }
            }, true);
        }
        window[ona] = null;
        document[ona] = null;
        if (document.body) {
            document.body[ona] = null;
        }
    }

    R("contextmenu");
    R("click");
    R("mousedown");
    R("mouseup");
    R("selectstart");
})();
