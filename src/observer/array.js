const arrayProto = Array.prototype //拿到数组原型上的方法

//继承  arrayMethods.proto = arrayProto
export const arrayMethods = Object.create(arrayProto)

// 当我们在arrayMethods上添加要重写的方法，用户使用这些方法就会走进重写的方法，如果使用其他方法会在原型链上找到

//要重写的方法
const methods = ['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse']

methods.forEach((method) => {
  arrayMethods[method] = function (...args) {
    console.log("数组方法"+method+"被调用了")
    const result = arrayProto[method].apply(this, args)
    const ob=this.__ob__
    let inserted
    switch (method) {
      case 'push':
      case 'unshift': //这两个方法都是追加，如果追加的内容是对象类型，再次做劫持
        inserted = args
        break;
      case 'splice':
        inserted = args.slice(2)
        console.log(inserted)
        break;
    }
    if (inserted) ob.observeArray(inserted)
    return result
  }
})
