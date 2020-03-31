class Complie{
    constructor(el, vm) {
        console.log('el', el);
        this.$el = document.querySelector(el);
        this.$vm = vm;
        if (this.$el) {
            // 转为片段

            this.$fragments = this.node2Fragments(this.$el);
            console.log(this.$el)
            console.log(this.$fragments);
            // 执行编译
            this.compile(this.$fragments);
            // 将片段追加到el中
            this.$el.appendChild(this.$fragments);
        }
    }
    node2Fragments(el) {
        const frag = document.createDocumentFragment();
        let child;
        while(child = el.firstChild) {
            frag.appendChild(child);
        }
        return frag;
    }
    compile(el) {
        const childNodes = el.childNodes;
        Array.from(childNodes).forEach(node => {
            if (this.isElement(node)) {
                // 元素
                // console.log('元素', node.nodeName)
            } else if (this.isInprotal(node)) {
                // 文本
                // console.log('文本', node.textContent)
                this.compileText(node);
            }
            if (node.childNodes && node.childNodes.length > 0) {
                this.compile(node);
            }
        })
    }
    compileText(node) {
        // console.log(RegExp.$1);
        // node.textContent = this.$vm.$data[RegExp.$1];
        this.update(node, this.$vm, RegExp.$1, 'text');
    }
    update(node, vm, key, dir) {
        const updaterFn = this[dir+'Updater'];
        updaterFn && updaterFn(node, vm[key]);
        new Watcher(vm, key, function(value) {
            console.log('value', value)
            updaterFn && updaterFn(node, value);
        })
    }
    textUpdater(node, value) {
        node.textContent = value;
    }
    isElement(node) {
        return node.nodeType === 1;
    }
    isInprotal(node) {
        return node.nodeType === 3 && /\{\{(.*)\}\}/.test(node.textContent);
    }
}