export function proxy(vm, data, key) {
  Object.defineProperty(vm, key, {
    get() {  // vm.a 
      return vm[data][key] //vm._data.a  
    },
    set(newVal) { // vm.a=100
      vm[data][key] = newVal // vm._data.a=100
    },
  })
}

export function def (obj, key, val) {
  Object.defineProperty(obj, key, {
    enumerable: false,//不可枚举
    configurable:false,//不可修改
    value:val//onserver实例
  })
}