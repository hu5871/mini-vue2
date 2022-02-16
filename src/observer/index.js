import { def } from '../util'
import { arrayMethods } from './array'

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
  Object.defineProperty(obj, key, {
    get() {
      // console.log('get', value)
      return value
    },
    set(newVal) {
      if (newVal === value) return
      observe(newVal) //如果用户将值改为对象继续拦截添加set和get
      value = newVal
      // console.log('set', value)
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
