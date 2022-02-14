import { compileToFunctions } from './compiler/index';
import {initState} from './state'
export function initMixin(Vue) {
  Vue.prototype._init = function (options) {
    const vm= this;

    vm.$options=options
    

    // 初始化状态,data、props、watch、computed 
    initState(vm)

    if (vm.$options.el) {
      vm.$mount(vm.$options.el)
    }
  };
  Vue.prototype.$mount = function(el){
   //  挂载操作

   const vm =this;
   el=document.querySelector(el);
   const options=vm.$options
   if(!options.render){
    //  将template转换成render方法
    let template =options.template
    if(template){

    }else if(el){
       if(el.outerHTML){//考虑兼容性问题
        template= el.outerHTML
       }else{
         const container=document.createElement('div')
         container.appendChild(el.cloneNode(true));//true为深克隆
         template=container.innerHTML
       }
    }
    // 拿到模版
    if(template){

      //将模版编译成render函数
      const render =compileToFunctions(template)

      options.render=render
    }
   }else{
    //  有render
   }
  }
}