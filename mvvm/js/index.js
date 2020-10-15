class myVue{
    constructor(options){
        // 传入配置参数
        this.options = options;
        // 根元素
        this.$el = document.querySelector(options.el);
        // 数据
        this.$data = options.data;

        // 保持相关指令，如v-model,v-text,当model改变时，我们会触发其中的指令更新，保证view也能实时更新
        this._directives = {};
        // 数据劫持，重新定义数据的set和get方法
        this._observe(this.$data);
        // 解析器，解析模板指令，并将每个对应的节点绑定更新函数，添加监听数据的订阅者，一旦数据发生变化，收到通知更新视图
        this._compile(this.$el);
    }

    // _observe函数，对data进行吹，重写data的set和get
    _observe(data){
        let val;
        for(let key in data){
            // 判断是不是属于本身的数学
            if(data.hasOwnProperty(key)){
                this._directives[key] = [];
            }

            val = data[key];
            // 递归遍历
            if(typeof val === 'object'){
                this._observe(val);
            }

            // 判断当前数据的执行队列
            let _dir = this._directives[key];

            // 重新定义数据的get和set方法
            Object.defineProperty(this.$data, key, {
                enumerable: true,
                configurable: true,
                get: function(){
                    return val;
                },
                set: function(newVal){
                    if(val !== newVal){
                        val = newVal;
                        _dir.forEach(function(item){
                            item._update();
                        })
                    }
                }
            })
        }
    }

    _compile(el){
        let nodes = el.children;
        for(let i = 0; i < nodes.length; i++){
            let node = nodes[i];

            if(node.children.length){
                this._compile(node);
            }
    
            // 如果有v-text指令，监控node的值并及时更新
            if(node.hasAttribute('v-text')){
                let attrValue = node.getAttribute('v-text');
                this._directives[attrValue].push(new Watcher('text', node, this, attrValue, 'innerHTML'));
            }
    
            // 如果有v-model属性，并且元素是input或textarea，我们监听他的input事件
            if(node.hasAttribute('v-model') && (node.tagName === 'INPUT' || node.tagName === 'TEXTAREA')){
                let _this = this;
                node.addEventListener('input', (function(){
                    let attrValue = node.getAttribute('v-model');
                    // 初始化复职
                    _this._directives[attrValue].push(new Watcher('input',node,_this,attrValue,'value'));
                    return function(){
                        _this.$data[attrValue] = node.value;
                    }
                })())
            }
        }
    }
}

class Watcher{
    /**
     * 
     * @param {*} name 指令名称，例如文本节点，该值为“text”
     * @param {*} el 指令对应的dom元素
     * @param {*} vm 指令所属的myVue实例
     * @param {*} exp 指令对应的值，本例为"myText"
     * @param {*} attr 绑定的属性值，本例为"innerHTML"
     */
    constructor(name, el, vm, exp, attr){
        this.name = name;
        this.el = el;
        this.vm = vm;
        this.exp = exp;
        this.attr = attr;

        this._update();
    }

    _update(){
        this.el[this.attr] = this.vm.$data[this.exp];
    }
}