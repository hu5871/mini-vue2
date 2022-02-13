import {initState} from './state'
export function initMixin(Vue) {
  Vue.prototype._init = function (options) {
    const vm= this;

    vm.$options=options
    

    // 初始化状态,data、props、watch、computed 
    initState(vm)
  };
}