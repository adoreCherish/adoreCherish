class Vue {
    constructor(options) {
        this.$options = options;
        this.$data = this.$options.data;
        // 监听每个data
        this.observer(this.$data);

        // new Wathcer();
        // this.$data.test;
        new Complie(options.el, this);

        if (this.$options.created) {
            this.$options.created.call(this);
        }
    }
    observer(data) {
        if (!data || typeof data !== 'object') return;
        Object.keys(data).forEach(key => {
            this.defineReactive(data, key, data[key]);
            this.proxyData(key);
        })
    }
    proxyData(key) {
        Object.defineProperty(this, key, {
            get() {
                return this.$data[key];
            },
            set(newVal) {
                this.$data[key] = newVal;
            }
        })
    }
    // 数据响应化
    defineReactive(object, key, value) {
        // 解决层次嵌套
        this.observer(value);
        const dep = new Dep();
        Object.defineProperty(object, key, {
            get() {
                // 默认一开始读一下 可以将dep添加到watcher里
                Dep.target && dep.addDep(Dep.target);
                return value;
            },
            set(newVal) {
                if (newVal === value) return;
                value = newVal;
                // console.log('我更新了', value);
                dep.notify();
            },
        });
    }
}
// 管理watcher
class Dep{
    constructor() {
        // 1个watcher对应一个属性
        this.deps = [];
    }
    addDep(dep) {
        this.deps.push(dep);
    }
    notify() {
        this.deps.forEach(dep => dep.update());
    }
}

class Watcher{
    constructor(vm, key, cb) {
        this.$vm = vm;
        this.$key = key;
        this.$cb = cb;
        // 将当前watcher实力指向Dep静态属性target
        Dep.target = this;
        this.$vm[this.$key]; // 触发get 添加依赖
        Dep.target = null;
    }
    update() {
        console.log('属性更新了');
        this.$cb.call(this.$vm, this.$vm[this.$key]);
    }
}