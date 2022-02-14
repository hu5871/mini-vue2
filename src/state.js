import { observe } from './observer/index'
import { proxy } from './util'

export function initState(vm) {
  //vm.$options
  const opts = vm.$options
  if (opts.props) {
    initProps(vm, opts.props)
  }
  if (opts.methods) {
    initMethods(vm, opts.methods)
  }
  if (opts.data) {
    initData(vm)
  }
  if (opts.computed) initComputed(vm, opts.computed)
  if (opts.watch) {
    initWatch(vm, opts.watch)
  }
}



function initProps(vm) {}
function initMethods(vm) {}
function initData(vm) {
  let data = vm.$options.data

  vm._data = data = typeof data === 'function' ? data.call(vm) : data

  //数据的劫持方案 ：对象 Object.defineProperty
  // 数组单独处理

  // 当从vm上取属性时，将属性的取值代理到vm._data上
   for (let key in data) {
    proxy(vm,"_data",key)
   }
  observe(data)
}
function initComputed(vm) {
  
}
function initWatch(vm) {}
