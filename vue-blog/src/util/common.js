



/**
 * @description: 获取DOM元素的真实样式
 * @param {DOM} ele 目标DOM元素
 * @param {Object} style 样式字段
 */
function setStyle(ele, style) {
    for (var key in style) {
        ele.style[key] = style[key];
    }
}

//querySelector
function $(ele) {
    return document.querySelector(ele);
}



/**
  * @description: 获取DOM元素的相对于window view左上角的偏移值
  * @param {DOM} ele 目标DOM元素
  * @return {object} 偏移值
  */
function getPosition(ele) {
    var pos = {
        x: 0,
        y: 0
    }
    while (ele.offsetParent) {
        pos.x += ele.offsetLeft;
        pos.y += ele.offsetTop;
        ele = ele.offsetParent;
        //考虑父元素边框
        pos.x += ele.clientLeft;
        pos.y += ele.clientTop;
    }
    return pos;
}

function getVDOMArr(eleArr) {
    var newArr = []
    for (var i = 0, len = eleArr.length; i < len; i++) {
        newArr.push(eleArr[i]);
    }
    return newArr;
}

/**
   * @description: 为DOM元素设置动画
   * @param {DOM} ele 目标DOM元素
   * @param {Object} style 目标样式字段
   * @param {Object} time 动画执行时间
   * @param {Object} speed 动画执行时间曲线
   * @param {Object} speed 动画结束后执行的回调函数
   */
function animation(ele, style, time, speed, callback) {
    //参数保护
    time = time || 500;
    speed = speed || "linear";
    //设置transition格式
    ele.style.transition = `${time}ms ${speed}`;
    //改变样式
    setStyle(ele, style);
    //动画结束后执行回调函数
    ele.addEventListener("transitionend", end);


    //为了便于事件解绑，采用命名函数
    function end() {
        //为保证回调函数一次动画后只执行一次，那么就需要对该事件解绑
        ele.removeEventListener("transitionend", end);
        //恢复transition
        ele.style.transition = `0ms`;
        //保证callback在解绑之后再触发，只执行一次
        setTimeout(function () {
            //执行回调函数
            callback && callback();
        }, 0)

    }
}
/**
 * @description: 获取DOM元素的真实样式
 * @param {DOM} ele 目标DOM元素
 * @param {string} attr 样式字段
 * @return {String} 目标样式
 */
function getStyle(ele, attr) {
    return ele.currentStyle ? ele.currentStyle[attr] : getComputedStyle(ele, false)[attr];
}
export default {
    $, getPosition, getVDOMArr, animation, setStyle, getStyle
}