(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vue = factory());
})(this, (function () { 'use strict';

  function compileToFunctions(template) {
    // html模版 =》 render函数
    //1.将html代码转化成ast语法树
    //  <div id="app"></div>
    //  {
    //    attrs:[{id:'app'}],
    //    tag:'div',
    //    children:[]
    //  }
    parseHTML(template); // 2.通过ast语法树重新生成代码
  }
  var ncname = "[a-zA-Z_][\\-\\.0-9_a-zA-Z]*"; // 匹配标签名 <aa-aa>

  var qnameCapture = "((?:".concat(ncname, "\\:)?").concat(ncname, ")"); //

  var startTagOpen = new RegExp("^<".concat(qnameCapture)); //标签开头的正则 捕获的内容是标签名

  var attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/; //匹配属性的 a="a" a='a' a=a

  var startTagClose = /^\s*(\/?)>/; //匹配标签结束的

  function parseHTML(html) {
    while (html) {
      console.log(html);
      var textEnd = html.indexOf('<');

      if (textEnd === 0) {
        //是标签
        var startTagMatch = parseStartTag();
        console.log(startTagMatch);
      }

      break;
    }

    function advance(n) {
      //  index+=n;
      html = html.substring(n); //将字符串进行截取操作
    }

    function parseStartTag() {
      var start = html.match(startTagOpen); //匹配标签开头

      if (start) {
        var match = {
          tagName: start[1],
          attrs: [] // start:index

        };
        advance(start[0].length); //删除开始标签
        // 如果是闭合标签 说明没有属性，所以每次循环都要判断一下

        var _end, attr; // 不是结尾标签 并且能拿到属性


        while (!(_end = html.match(startTagClose)) && (attr = html.match(attribute))) {
          // 假设 我们的 元素是这的 <div id="id"></div> 
          // attribute正则 逐步分析得到的数据 
          // s*([^\s"'<>\/=]+)： s* 匹配连续的空格 ^\s 不是空格 "'<>不是双引或者单引 +前面的子表达式匹配多次 后面的正则基本就是匹配双引号、单引号、没有引号这三种分组情况，分别返回它们的所在分组匹配结果
          console.log(attr);
          match.attrs.push({
            name: attr[1],
            //attr是   {0:" id="app "",1:"id",2:"=",3:"app",4:'app',5:app}这样的对象，它345只会出现一种情况，因为你不能是id="app'  这样的双｜单引号结尾
            value: attr[3] || attr[4] || attr[5]
          }); // 匹配完截取html

          advance(attr[0].length);
        }

        if (_end) {
          //最后匹配到>号，把它删掉
          advance(_end[0].length);
          return match;
        }
      }
    }
  }

  function _typeof(obj) {
    "@babel/helpers - typeof";

    return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
      return typeof obj;
    } : function (obj) {
      return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    }, _typeof(obj);
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    Object.defineProperty(Constructor, "prototype", {
      writable: false
    });
    return Constructor;
  }

  function proxy(vm, data, key) {
    Object.defineProperty(vm, key, {
      get: function get() {
        // vm.a 
        return vm[data][key]; //vm._data.a  
      },
      set: function set(newVal) {
        // vm.a=100
        vm[data][key] = newVal; // vm._data.a=100
      }
    });
  }
  function def(obj, key, val) {
    Object.defineProperty(obj, key, {
      enumerable: false,
      //不可枚举
      configurable: false,
      //不可修改
      value: val //onserver实例

    });
  }

  var arrayProto = Array.prototype; //拿到数组原型上的方法
  //继承  arrayMethods.proto = arrayProto

  var arrayMethods = Object.create(arrayProto); // 当我们在arrayMethods上添加要重写的方法，用户使用这些方法就会走进重写的方法，如果使用其他方法会在原型链上找到
  //要重写的方法

  var methods = ['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'];
  methods.forEach(function (method) {
    arrayMethods[method] = function () {
      console.log("数组方法" + method + "被调用了");

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      var result = arrayProto[method].apply(this, args);
      var ob = this.__ob__;
      var inserted;

      switch (method) {
        case 'push':
        case 'unshift':
          //这两个方法都是追加，如果追加的内容是对象类型，再次做劫持
          inserted = args;
          break;

        case 'splice':
          inserted = args.slice(2);
          console.log(inserted);
          break;
      }

      if (inserted) ob.observeArray(inserted);
      return result;
    };
  });

  var Observer = /*#__PURE__*/function () {
    function Observer(value) {
      _classCallCheck(this, Observer);

      // 判断一个对象是否被观测过,看有没有__ob__属性
      def(value, '__ob__', this);

      if (Array.isArray(value)) {
        value.__proto__ = arrayMethods;
        this.observeArray(value);
      } else {
        this.walk(value);
      }
    }

    _createClass(Observer, [{
      key: "walk",
      value: function walk(obj) {
        var keys = Object.keys(obj); //获取对象的key

        keys.forEach(function (key) {
          defineReactive(obj, key, obj[key]);
        });
      }
    }, {
      key: "observeArray",
      value: function observeArray(items) {
        for (var i = 0; i < items.length; i++) {
          observe(items[i]);
        }
      }
    }]);

    return Observer;
  }();

  function defineReactive(obj, key, value) {
    observe(value);
    Object.defineProperty(obj, key, {
      get: function get() {
        console.log('get', value);
        return value;
      },
      set: function set(newVal) {
        if (newVal === value) return;
        observe(newVal); //如果用户将值改为对象继续拦截添加set和get

        value = newVal;
        console.log('set', value);
      }
    });
  }

  function observe(data) {
    if (_typeof(data) !== 'object' || typeof data === null) {
      return data;
    }

    if (data.__ob__) {
      return data;
    }

    return new Observer(data);
  }

  function initState(vm) {
    //vm.$options
    var opts = vm.$options;

    if (opts.props) {
      initProps(vm, opts.props);
    }

    if (opts.methods) {
      initMethods(vm, opts.methods);
    }

    if (opts.data) {
      initData(vm);
    }

    if (opts.computed) initComputed(vm, opts.computed);

    if (opts.watch) {
      initWatch(vm, opts.watch);
    }
  }

  function initProps(vm) {}

  function initMethods(vm) {}

  function initData(vm) {
    var data = vm.$options.data;
    vm._data = data = typeof data === 'function' ? data.call(vm) : data; //数据的劫持方案 ：对象 Object.defineProperty
    // 数组单独处理
    // 当从vm上取属性时，将属性的取值代理到vm._data上

    for (var key in data) {
      proxy(vm, "_data", key);
    }

    observe(data);
  }

  function initComputed(vm) {}

  function initWatch(vm) {}

  function initMixin(Vue) {
    Vue.prototype._init = function (options) {
      var vm = this;
      vm.$options = options; // 初始化状态,data、props、watch、computed 

      initState(vm);

      if (vm.$options.el) {
        vm.$mount(vm.$options.el);
      }
    };

    Vue.prototype.$mount = function (el) {
      //  挂载操作
      var vm = this;
      el = document.querySelector(el);
      var options = vm.$options;

      if (!options.render) {
        //  将template转换成render方法
        var template = options.template;

        if (template) ; else if (el) {
          if (el.outerHTML) {
            //考虑兼容性问题
            template = el.outerHTML;
          } else {
            var container = document.createElement('div');
            container.appendChild(el.cloneNode(true)); //true为深克隆

            template = container.innerHTML;
          }
        } // 拿到模版


        if (template) {
          //将模版编译成render函数
          var render = compileToFunctions(template);
          options.render = render;
        }
      }
    };
  }

  function Vue(options) {
    // console.log(options)
    this._init(options);
  }

  initMixin(Vue);

  return Vue;

}));
//# sourceMappingURL=vue.js.map
