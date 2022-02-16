export function proxy(vm, data, key) {
  Object.defineProperty(vm, key, {
    get() {
      // vm.a
      return vm[data][key] //vm._data.a
    },
    set(newVal) {
      // vm.a=100
      vm[data][key] = newVal // vm._data.a=100
    },
  })
}

export function def(obj, key, val) {
  Object.defineProperty(obj, key, {
    enumerable: false, //不可枚举
    configurable: false, //不可修改
    value: val, //onserver实例
  })
}

export const LIFECYCLE_HOOKS = [
  'beforeCreate',
  'created',
  'beforeMount',
  'mounted',
  'beforeUpdate',
  'updated',
  'beforeDestroy',
  'destroyed',
]

const strats = {}

strats.data = function (parentVal,childVal) {
  return childVal

}
strats.computed = function () {}
strats.watch = function () {}
LIFECYCLE_HOOKS.forEach((hook) => {
  strats[hook] = mergeHook
})
console.log(strats)
function mergeHook(parentVal,childVal) { //生命周期合并
  //最终合并的是一个数组
   if(childVal){ //儿子有值 合并父亲的
      if(parentVal){//儿子 、 父亲也有
        return parentVal.concat(childVal)
      }else{//只有儿子有
          return [childVal] //父亲是options 儿子就是mixin  第一次父亲是空对象 {}  第二个是{create:function}
      }
   }else{ //父亲直接return 因为不需要考虑儿子了
      return parentVal
   }
}


export function mergeOptions(parent, child) {
  const options = {}
  //遍历父亲，可能父亲有，儿子没有
  for (const key in parent) {
    mergeField(key)
  }

  //  儿子有，父亲没有
  for (const key in child) {
    if (!parent.hasOwnProperty(key)) {
      mergeField(key)
    }
  }

  function mergeField(key) {
    //  根据key做不同的策略来进行合并
    if( strats[key]){
      options[key]=strats[key](parent[key],child[key])
    }else{
      options[key]=child[key]
    }
  }
  return options
} 
