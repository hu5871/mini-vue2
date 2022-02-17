import { compileToFunctions } from './compiler/index'
import { callHook, mountComponent } from './lifecycle'
import { initState } from './state'
import { mergeOptions } from './util'
export function initMixin(Vue) {
  Vue.prototype._init = function (options) {
    const vm = this
    // _init可能被子组件调用
    //所以需要拿到当前实例的构造函数，如果是子类调用就是子类构造函数
    vm.$options = mergeOptions(vm.constructor.options, options) //将用户自定义的options和全局的options进行合并
    callHook(vm,'beforeCreate')
    // 初始化状态,data、props、watch、computed
    initState(vm)
    callHook(vm,'created')
    if (vm.$options.el) {
      vm.$mount(vm.$options.el)
    }
  }
  Vue.prototype.$mount = function (el) {
    //  挂载操作

    const vm = this
    el = document.querySelector(el)
    const options = vm.$options
    if (!options.render) {
      //没有render
      //  将template转换成render方法
      let template = options.template
      if (template) {
      } else if (el) {
        //有el
        if (el.outerHTML) {
          //考虑兼容性问题
          template = el.outerHTML
        } else {
          const container = document.createElement('div')
          container.appendChild(el.cloneNode(true)) //true为深克隆
          template = container.innerHTML
        }
      }
      //将模版编译成render函数
      const render = compileToFunctions(template)
      options.render = render
    } else {
      //  有render
    }
    // 需要挂在这个组件
    mountComponent(vm, el)
  }
}
