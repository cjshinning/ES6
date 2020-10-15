(function(global){
    class Dialog {
        constructor(opts){
            this.opts = Object.assign({
                title: '标题',
                content: '内容',
                buttons: []
            }, opts || {})

            this.init();
        }

        render(){
            let div = document.createElement('div');
            div.setAttribute('className', 'app-dialog');

            let footHtml = '';
            this.opts.buttons.map(btn => {
                footHtml +=  `<a href="javascript:;" class="app-dialog-btn">${btn.txt}</a>`;
            })

            div.innerHTML = `
                <div class="app-dialog-hd">${this.opts.title}</div>
                <div class="app-dialog-bd">${this.opts.content}</div>
                ${footHtml}
            `;

            document.body.appendChild(div);
            this.el = div;
        }

        event(){
            let _this = this;
            let btns = this.el.querySelectorAll('.app-dialog-btn');

            [].slice.call(btns).forEach((item, index) => {
                item.addEventListener("click", () => {
                    this.opts.buttons[index].callback(_this);
                });
            })
        }

        destroy(){
            document.body.removeChild(this.el);
        }

        init(){
            this.render();
            this.event();
        }
    }

    global.Dialog = Dialog;
}(window));

const dialog = {};

dialog.alert = function(msg, fn){
    return new Dialog({
        title: '标题',
        content: `${msg}`,
        buttons: [
            {
                txt: '确定',
                callback: function(d){
                    d.destroy();
                    typeof fn === 'function' && fn.call(this, d);
                }
            },
            {
                txt: '取消',
                callback: function(d){
                    d.destroy();
                }
            }
        ]
    })
}

let btn = document.getElementById('btn');
btn.addEventListener('click', function(){
    dialog.alert('我是新的内容', function(){
        console.log(888);
    })

    // new Dialog({
    //     content: '我是一段新的内容啊',
    //     buttons: [
    //         {
    //             txt: '确定',
    //             callback: function(d){
    //                 console.log(123);
    //                 d.destroy();
    //             }
    //         },
    //         {
    //             txt: '取消',
    //             callback: function(d){
    //                 console.log(456);
    //                 d.destroy();
    //             }
    //         }
    //     ]
    // })
})




