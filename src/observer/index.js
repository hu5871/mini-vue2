import { def } from '../util'
import { arrayMethods } from './array'
import Dep from './dep'

class Observer {
  constructor(value) {
    // 判断一个对象是否被观测过,看有没有__ob__属性

    def(value, '__ob__', this)
    if (Array.isArray(value)) {
      value.__proto__ = arrayMethods

      this.observeArray(value)
    } else {
      this.walk(value)
    }
  }
  walk(obj) {
    let keys = Object.keys(obj) //获取对象的key

    keys.forEach((key) => {
      defineReactive(obj, key, obj[key])
    })
  }
  observeArray(items) {
    for (let i = 0; i < items.length; i++) {
      observe(items[i])
    }
  }
}

function defineReactive(obj, key, value) {
  observe(value)
  let dep = new Dep() //每个属性产生一个Dep
  //当页面取值时 说明这个值用来渲染了，将这个watcher和属性对应起来
  Object.defineProperty(obj, key, {
    get() {
      console.log('get', value)
      console.log('depTargin',Dep.target);
      if(Dep.target){
        dep.depend()
      }
      return value
    },
    set(newVal) {
      if (newVal === value) return
      observe(newVal) //如果用户将值改为对象继续拦截添加set和get
      value = newVal
      dep.notify()
      console.log('set', value)
    },
  })
}

export function observe(data) {
  if (typeof data !== 'object' || typeof data === null) {
    return data
  }
  if (data.__ob__) {
    return data
  }
  return new Observer(data)
}
