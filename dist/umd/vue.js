(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vue = factory());
})(this, (function () { 'use strict';

  const arrayProto = Array.prototype; //拿到数组原型上的方法

  //继承  arrayMethods.proto = arrayProto
  const arrayMethods = Object.create(arrayProto);

  // 当我们在arrayMethods上添加要重写的方法，用户使用这些方法就会走进重写的方法，如果使用其他方法会在原型链上找到

  //要重写的方法
  const methods = ['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'];

  methods.forEach((method) => {
    arrayMethods[method] = function (...args) {
      // console.log(method+"被调用了")
      const result = arrayProto[method].apply(this, args);
      const ob=this.__ob__;
      let inserted;
      switch (method) {
        case 'push':
        case 'unshift': //这两个方法都是追加，如果追加的内容是对象类型，再次做劫持
          inserted = args;
          break;
        case 'splice':
          inserted = args.slice(2);
          console.log(inserted);
          break;
      }
      if (inserted) ob.observeArray(inserted);
      return result
    };
  });

  class Observer {
    constructor(value) {
      // 判断一个对象是否被观测过,看有没有__ob__属性
      Object.defineProperty(value, "__ob__", {
        enumerable: false,//不可枚举
        configurable:false,//不可修改
        value:this//onserver实例
      });

      if (Array.isArray(value)) {
        value.__proto__ = arrayMethods;

        this.observeArray(value);
      } else {
        this.walk(value);
      }
    }
    walk(obj) {
      let keys = Object.keys(obj); //获取对象的key

      keys.forEach((key) => {
        defineReactive(obj, key, obj[key]);
      });
    }
    observeArray(items){
      for (let i = 0; i < items.length; i++) {
        observe(items[i]);
        
      }
    }
  }

  function defineReactive(obj, key, value) {
    observe(value);
    Object.defineProperty(obj, key, {
      get() {
        console.log('get', value);
        return value
      },
      set(newVal) {
        if (newVal === value) return
        observe(newVal); //如果用户将值改为对象继续拦截添加set和get
        value = newVal;
        console.log("set",value);
      },
    });
  }

  function observe(data) {
    if (typeof data !== 'object' || typeof data === null) {
      return data
    }
    if(data.__ob__){
      return data
    }
    return new Observer(data)
  }

  function initState(vm){ //vm.$options
    const opts = vm.$options; 

    if(opts.props){
      initProps(vm,opts.props);
    }
    if(opts.methods){
      initMethods(vm,opts.methods);
    }
    if(opts.data){
      initData(vm);
    }
    if (opts.computed) initComputed(vm, opts.computed);
    if (opts.watch) {
      initWatch(vm, opts.watch);
    }
  }

  function initProps(vm){}
  function initMethods(vm){}
  function initData(vm){
    let data=vm.$options.data;

    vm._data=data= typeof data==="function" ? data.call(vm) :data;


    //数据的劫持方案 ：对象 Object.defineProperty
    // 数组单独处理

    observe(data);

  }
  function initComputed(){vm;}
  function initWatch(vm){}

  function initMixin(Vue) {
    Vue.prototype._init = function (options) {
      const vm= this;

      vm.$options=options;
      

      // 初始化状态,data、props、watch、computed 
      initState(vm);
    };
  }

  function Vue(options){
    
    // console.log(options)
    this._init(options);
  }

  initMixin(Vue);

  return Vue;

}));
//# sourceMappingURL=vue.js.map
