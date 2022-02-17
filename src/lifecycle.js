import { patch } from "./vdom/patch";
import Watcher from "./observer/watcher";

export function lifecycleMixin(Vue){
  Vue.prototype._update = function (vnode){
     console.log(vnode);
     const vm= this
     vm.$el= patch(vm.$el,vnode);//用新的元素替换老的vm.$el
  } 
}

export function mountComponent(vm,el){
  vm.$el=el
  callHook(vm,'beforeMount')
  // 调用render渲染el属性
  //先调用render方法创建虚拟节点，再见虚拟节点渲染到页面
  // vm._update(vm._render())

  let updateComponent = ()=>{
    vm._update(vm._render())
  }
  // 这个watcher用于渲染
  new Watcher(vm,updateComponent,()=>{
    callHook(vm,'beforeUpdate')
  },true)
  callHook(vm,'mounted')
}

export function callHook(vm,hook){
    const handlers=vm.$options[hook]
    if(handlers){
      for(let i=0;i<handlers.length;i++){
        handlers[i].call(vm)
      }
    }
}