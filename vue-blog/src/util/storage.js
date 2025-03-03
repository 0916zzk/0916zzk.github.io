class Storage {
    constructor(type = "local") {
        this.storage = type === "local" ? localStorage : sessionStorage;
        this.history = {};
    }
    setStorage(...args) {
        const len = args.length;
        if (len === 0) return false;
        if (len === 2) {
            //key 和 value 都是基础类型
            if (args.every(item => typeof item !== 'object')) {
                this.history[args[0]] = args[1];
                this.storage.setItem(String(args[0]), String(args[1]));
            }
            return {
                [args[0]]: args[1]
            }
        }
        if (len === 1) {
            if (Object.prototype.toString.call(args[0]) === "[object Object]") {
                let obj = args[0];
                Object.assign(this.history, obj);
                return Object.entries(obj).map(([key, value]) => {
                    this.storage.setItem(key, value);
                    return key;
                })
            }
        }
        //返回所有设置历史 供check
        return this.history;
    }
    getStorage(...args) {
        const len = args.length;
        if (len === 0) {
            return this.history;
        }
        if (len === 1 && Object.prototype.toString.call(args[0]) === "[object Array]" && args[0].length) {
            let arr = args[0].slice();
            return arr.reduce((acc, curr) => {
                acc[curr] = this.storage.getItem(curr);
                return acc;
            }, {});
        }
        if (len === 1 && Object.prototype.toString.call(args[0]) === "[object String]" && args[0].length) {
            return this.storage.getItem(args[0]);
        }
    }
    removeStorage(...args) {
        args = args.flat(Infinity);
        args.forEach(item => {
            if (typeof item !== 'object') {
                if (this.history[item]) {
                    delete this.history[item]
                }
                this.storage.removeItem(String(item));
            }
        })
    }

    clearStorage() {
        this.history = {};
        this.storage.clear();
    }

}
export default Storage