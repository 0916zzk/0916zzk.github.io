function throttle(fn, time) {
    let now = new Date()
    return function (...args) {
        if (new Date() - now > time) {
            now = new Date()
            fn(...args)
        }
    }
}
function isEmpty(obj) {
    if (!(typeof obj === "object")) return !obj
    if (Array.isArray(obj)) {
        return obj.length === 0
    }
    return Object.entries(obj).length === 0
}

function toDouble(num) {
    return String(num)[1] && String(num) || '0' + num;
}
function formatDate(date = new Date(), format = "yyyy-MM-dd hh:mm:ss") {

    let regMap = {
        'y': date.getFullYear(),
        'M': toDouble(date.getMonth() + 1),
        'd': toDouble(date.getDate()),
        'h': toDouble(date.getHours()),
        'm': toDouble(date.getMinutes()),
        's': toDouble(date.getSeconds()),
    }

    //逻辑(正则替换 对应位置替换对应值) 数据(日期验证字符 对应值) 分离
    return Object.entries(regMap).reduce((acc, [reg, value]) => {
        return acc.replace(new RegExp(`${reg}+`, 'g'), value);
    }, format);
}
function firsttoUpperCase(str) {
    return str.charAt(0).toUpperCase() + str.slice(1)
}
function isMobile() {
    return navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/)
}
export default {
    throttle, isEmpty, formatDate, firsttoUpperCase, isMobile
}