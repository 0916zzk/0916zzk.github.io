
export default class Drag {
    constructor(wrap) {
        this.wrap = wrap
        this.startPosition = {
            x: 0,
            y: 0,
            DOMLeft: 0,
            DOMTop: 0,
        }
        this.init()
    }
    init() {
        this.keydown = false
        //可拖动盒子添加定位,不改变其原有位置
        let left = this.wrap.offsetLeft
        let top = this.wrap.offsetTop
        this.wrap.style.margin = 0
        this.wrap.style.left = left + "px"
        this.wrap.style.top = top + "px"
        this.startPosition.DOMLeft = left
        this.startPosition.DOMTop = top
        this.wrap.style.position = "absolute"
        this.parentPosition = {
            left: this.wrap.offsetParent.offsetLeft,
            right: this.wrap.offsetParent.offsetLeft + this.wrap.offsetParent.offsetWidth,
            top: this.wrap.offsetParent.offsetTop,
            bottom: this.wrap.offsetParent.offsetHeight
        }

        //绑定事件
        this.wrap.querySelector("[data-drag = 'true']").style.cursor = "pointer"
        this.wrap.querySelector("[data-drag = 'true']").addEventListener("mousedown", this.dragEvent.bind(this), false);
        document.addEventListener("mousemove", this.dragEvent.bind(this), false);
        document.addEventListener("mouseup", this.dragEvent.bind(this), false);
    }
    dragEvent(e) {
        e.preventDefault();
        this[e.type] && this[e.type](e);
    }
    mousedown(e) {
        //记录鼠标按下的位置坐标
        this.startPosition.x = e.clientX;
        this.startPosition.y = e.clientY;
        //鼠标按下，此时可以开始监听鼠标移动事件
        this.keydown = true;
    }
    mousemove(e) {
        if (this.keydown) {
            var _left = this.startPosition.DOMLeft + (e.clientX - this.startPosition.x);
            var _top = this.startPosition.DOMTop + (e.clientY - this.startPosition.y);
            var maxLeft = this.wrap.offsetParent.offsetWidth - this.wrap.offsetWidth;
            var maxTop = this.wrap.offsetParent.offsetHeight - this.wrap.offsetHeight;
            //限制左右移动的最大距离
            _left = Math.max(0, _left);
            _left = Math.min(maxLeft, _left);
            //限制上下移动的最大距离
            _top = Math.max(0, _top);
            _top = Math.min(maxTop, _top);
            this.wrap.style.left = _left + "px";
            this.wrap.style.top = _top + "px";

            //当我们将鼠标移动到浏览之外再松开时，浏览器则无法检测鼠标抬起事件
            //所以当鼠标移出容器后，则视为鼠标抬起
            if (e.clientX < this.parentPosition.left || e.clientY < this.parentPosition.top || e.clientX > this.parentPosition.right || e.clientY > this.parentPosition.bottom) {
                this.keydown = false;
                this.startPosition.DOMLeft = this.wrap.offsetLeft
                this.startPosition.DOMTop = this.wrap.offsetTop
            }
        }
    }
    mouseup(e) {
        if (this.keydown) {
            this.startPosition.DOMLeft = this.wrap.offsetLeft
            this.startPosition.DOMTop = this.wrap.offsetTop
            this.keydown = false;
        }
    }

}