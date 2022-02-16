(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vue = factory());
})(this, (function () { 'use strict';

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
  var LIFECYCLE_HOOKS = ['beforeCreate', 'created', 'beforeMount', 'mounted', 'beforeUpdate', 'updated', 'beforeDestroy', 'destroyed'];
  var strats = {};

  strats.data = function (parentVal, childVal) {
    return childVal;
  };

  strats.computed = function () {};

  strats.watch = function () {};

  LIFECYCLE_HOOKS.forEach(function (hook) {
    strats[hook] = mergeHook;
  });
  console.log(strats);

  function mergeHook(parentVal, childVal) {
    //生命周期合并
    //最终合并的是一个数组
    if (childVal) {
      //儿子有值 合并父亲的
      if (parentVal) {
        //儿子 、 父亲也有
        return parentVal.concat(childVal);
      } else {
        //只有儿子有
        return [childVal]; //父亲是options 儿子就是mixin  第一次父亲是空对象 {}  第二个是{create:function}
      }
    } else {
      //父亲直接return 因为不需要考虑儿子了
      return parentVal;
    }
  }

  function mergeOptions(parent, child) {
    var options = {}; //遍历父亲，可能父亲有，儿子没有

    for (var key in parent) {
      mergeField(key);
    } //  儿子有，父亲没有


    for (var _key in child) {
      if (!parent.hasOwnProperty(_key)) {
        mergeField(_key);
      }
    }

    function mergeField(key) {
      //  根据key做不同的策略来进行合并
      if (strats[key]) {
        options[key] = strats[key](parent[key], child[key]);
      } else {
        options[key] = child[key];
      }
    }

    return options;
  }

  function initGlobalApi(Vue) {
    Vue.options = {};

    Vue.mixin = function (mixin) {
      this.options = mergeOptions(this.options, mixin); //选项合并：把用户传进来的选贤合并到当前的options上
    };
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

  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
  }

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function _iterableToArrayLimit(arr, i) {
    var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];

    if (_i == null) return;
    var _arr = [];
    var _n = true;
    var _d = false;

    var _s, _e;

    try {
      for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

    return arr2;
  }

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  var ncname = "[a-zA-Z_][\\-\\.0-9_a-zA-Z]*"; // 匹配标签名 <aa-aa>

  var qnameCapture = "((?:".concat(ncname, "\\:)?").concat(ncname, ")"); //

  var startTagOpen = new RegExp("^<".concat(qnameCapture)); //标签开头的正则 捕获的内容是标签名

  var endTag = new RegExp("^<\\/".concat(qnameCapture, "[^>]*>")); //匹配标签结尾的 </div>

  var attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/; //匹配属性的 a="a" a='a' a=a

  var startTagClose = /^\s*(\/?)>/; //匹配标签结束的 >

  var defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g; // {{ xxx }}

  function parseHTML(html) {
    var root;
    var currentParent;
    var stack = [];

    function createASTElement(tagName, attrs) {
      return {
        tag: JSON.stringify(tagName),
        //标签名
        type: 1,
        //元素类型
        children: [],
        //子元素列表
        attrs: attrs,
        //属性列表
        parent: null //父元素

      };
    }

    function start(tagName, attrs) {
      // console.log('start',typeof tagName,attrs)
      var element = createASTElement(tagName, attrs);

      if (!root) {
        root = element;
      }

      currentParent = element; //保存当前解析的标签

      stack.push(element);
    }

    function end(tagName) {
      // console.log('end', tagName)
      //   <div id="app"><p></p> hello </div>
      // console.log(stack)
      var element = stack.pop(); //

      currentParent = stack[stack.length - 1]; //取出栈中的最后一个

      if (currentParent) {
        element.parent = currentParent;
        currentParent.children.push(element);
      } // console.log(stack)

    }

    function chars(text) {
      // console.log('text', text)
      text = text.trim();

      if (text) {
        // console.log(currentParent)
        currentParent.children.push({
          type: 3,
          //文本类型
          text: text
        });
      }
    }

    while (html) {
      var textEnd = html.indexOf('<');

      if (textEnd === 0) {
        //是标签
        var startTagMatch = parseStartTag(); //处理开始

        if (startTagMatch) {
          start(startTagMatch.tagName, startTagMatch.attrs);
          continue;
        }

        var endTagMatch = html.match(endTag); //匹配到结束标签
        // console.log('endTagMatch',endTagMatch)
        // break

        if (endTagMatch) {
          //处理结束标签
          advance(endTagMatch[0].length);
          end(endTagMatch[1]);
          continue;
        }
      }

      var text = void 0;

      if (textEnd >= 0) {
        //处理文本
        text = html.substring(0, textEnd);
      }

      if (text) {
        //有文本处理文本
        // 删掉html中的文本
        advance(text.length);
        chars(text);
      }
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
          // 假设 我们的 元素是这的 <div id="id">hello vue2</div>
          // attribute正则 逐步分析得到的数据
          // s*([^\s"'<>\/=]+)： s* 匹配连续的空格 ^\s 不是空格 "'<>不是双引或者单引 +前面的子表达式匹配多次 后面的正则基本就是匹配双引号、单引号、没有引号这三种分组情况，分别返回它们的所在分组匹配结果
          // console.log(attr)
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

    return root;
  }

  function generate(ast) {
    // console.log(ast)
    var children = genChildren(ast);
    var code = "_c(".concat(ast.tag, ",").concat(ast.attrs.length ? genProps(ast.attrs) : undefined).concat(children ? ",".concat(children) : '', ")"); // console.log(code)

    return code;
  }

  function genProps(attrs) {
    // console.log(attrs)
    var str = '';

    var _loop = function _loop() {
      var attr = attrs[i];

      if (attr.name == 'style') {
        var obj = {};
        attr.value.split(';').forEach(function (item) {
          var _item$split = item.split(':'),
              _item$split2 = _slicedToArray(_item$split, 2),
              key = _item$split2[0],
              value = _item$split2[1];

          obj[key] = value;
          attr.value = obj;
        });
      }

      str += "".concat(attr.name, ":").concat(JSON.stringify(attr.value), ",");
    };

    for (var i = 0; i < attrs.length; i++) {
      _loop();
    }

    return "{".concat(str.slice(0, -1), "}");
  }

  function genChildren(ast) {
    var children = ast.children;

    if (children) {
      return children.map(function (child) {
        return gen(child);
      }).join(',');
    }
  }

  function gen(node) {
    if (node.type === 1) {
      return generate(node);
    }

    if (node.type === 3) {
      var text = node.text;

      if (!defaultTagRE.test(text)) {
        //  如果是普通文本： 不带{{}}
        return "_v(".concat(JSON.stringify(text), ")");
      }

      var tokens = []; //存放每一段代码

      var lastIndex = defaultTagRE.lastIndex = 0; //如果正则是全局模式 需要每次使用前置为零

      var match, index; //每次匹配到的结果和匹配到的索引

      while (match = defaultTagRE.exec(text)) {
        index = match.index; // console.log(match)
        // console.log(lastIndex)

        if (index > lastIndex) {
          tokens.push(JSON.stringify(text.slice(lastIndex, index)));
        }

        tokens.push("_s(".concat(match[1].trim(), ")"));
        lastIndex = index + match[0].length;
      }

      if (lastIndex < text.length) {
        tokens.push(JSON.stringify(text.slice(lastIndex)));
      }

      return "_v(".concat(tokens.join("+"), ")");
    }
  }

  function compileToFunctions(template) {
    // html模版 =》 render函数
    //1.将html代码转化成ast语法树
    //  <div id="app"></div>
    //  {
    //    attrs:[{id:'app'}],
    //    tag:'div',
    //    children:[]
    //  }
    var ast = parseHTML(template); // console.log(ast)
    // 2.通过ast语法树重新生成代码

    var code = generate(ast); // 3.将字符串转换成函数

    var render = new Function("with(this){return ".concat(code, "}")); // console.log(render);

    return render;
  }

  function patch(oldVnode, vnode) {
    // 将虚拟节点转换成真实节点
    var el = createElm(vnode); //产生真实的dom

    var parentNode = oldVnode.parentNode; //获取老的app的父元素 》 body

    parentNode.insertBefore(el, oldVnode.nextSibling); //当前的真实元素插入到app的后面

    parentNode.removeChild(oldVnode); //删除老的节点
  }

  function createElm(vnode) {
    var tag = vnode.tag,
        children = vnode.children;
        vnode.key;
        vnode.data;
        var text = vnode.text; // console.log(vnode)

    if (typeof tag === 'string') {
      vnode.el = document.createElement(tag);
      updateProperties(vnode);
      children.forEach(function (child) {
        vnode.el.appendChild(createElm(child));
      });
    } else {
      vnode.el = document.createTextNode(text);
    }

    return vnode.el;
  }

  function updateProperties(vnode) {
    var el = vnode.el;
    var newProps = vnode.data || {};

    for (var key in newProps) {
      if (key === 'style') {
        for (var styleName in newProps[key]) {
          el.style[styleName] = newProps.style[styleName];
        }
      } else if (key === "class") {
        el.className = newProps[key];
      } else {
        el.setAttribute(key, newProps[key]);
      }
    }
  }

  function lifecycleMixin(Vue) {
    Vue.prototype._update = function (vnode) {
      console.log(vnode);
      var vm = this;
      patch(vm.$el, vnode);
    };
  }
  function mountComponent(vm, el) {
    callHook(vm, 'beforeMount'); // 调用render渲染el属性
    //先调用render方法创建虚拟节点，再见虚拟节点渲染到页面

    vm._update(vm._render());

    callHook(vm, 'mounted');
  }
  function callHook(vm, hook) {
    var handlers = vm.$options[hook];

    if (handlers) {
      for (var i = 0; i < handlers.length; i++) {
        handlers[i].call(vm);
      }
    }
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
        // console.log('get', value)
        return value;
      },
      set: function set(newVal) {
        if (newVal === value) return;
        observe(newVal); //如果用户将值改为对象继续拦截添加set和get

        value = newVal; // console.log('set', value)
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
      var vm = this; // _init可能被子组件调用
      //所以需要拿到当前实例的构造函数，如果是子类调用就是子类构造函数

      vm.$options = mergeOptions(vm.constructor.options, options); //将用户自定义的options和全局的options进行合并

      callHook(vm, 'beforeCreate');
      console.log(vm.$options); // 初始化状态,data、props、watch、computed

      initState(vm);
      callHook(vm, 'created');

      if (vm.$options.el) {
        vm.$mount(vm.$options.el);
      }
    };

    Vue.prototype.$mount = function (el) {
      //  挂载操作
      var vm = this;
      el = document.querySelector(el);
      vm.$el = el;
      var options = vm.$options;

      if (!options.render) {
        //没有render
        //  将template转换成render方法
        var template = options.template;

        if (template) ; else if (el) {
          //有el
          if (el.outerHTML) {
            //考虑兼容性问题
            template = el.outerHTML;
          } else {
            var container = document.createElement('div');
            container.appendChild(el.cloneNode(true)); //true为深克隆

            template = container.innerHTML;
          }
        } //将模版编译成render函数


        var render = compileToFunctions(template);
        options.render = render;
      } // 需要挂在这个组件


      mountComponent(vm);
    };
  }

  function renderMixin(Vue) {
    Vue.prototype._c = function () {
      //创建元素
      return createElement.apply(void 0, arguments);
    };

    Vue.prototype._s = function (val) {
      //stringify
      return val == null ? '' : _typeof(val) == 'object' ? JSON.stringify(val) : val;
    };

    Vue.prototype._v = function (text) {
      //创建虚拟文本元素
      return createTextVnode(text);
    };

    Vue.prototype._render = function () {
      var vm = this;
      var render = vm.$options.render;
      var vnode = render.call(this);
      return vnode;
    };
  }

  function createElement(tag) {
    var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    for (var _len = arguments.length, children = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      children[_key - 2] = arguments[_key];
    }

    // console.log(arguments);
    return vnode(tag, data, data === null || data === void 0 ? void 0 : data.key, children);
  }

  function createTextVnode(text) {
    // console.log(text);
    return vnode(undefined, undefined, undefined, undefined, text);
  }

  function vnode(tag, data, key, children, text) {
    return {
      tag: tag,
      data: data,
      key: key,
      children: children,
      text: text
    };
  }

  function Vue(options) {
    // console.log(options)
    this._init(options);
  } //原型方法


  initMixin(Vue);
  lifecycleMixin(Vue);
  renderMixin(Vue); //静态方法

  initGlobalApi(Vue);

  return Vue;

}));
//# sourceMappingURL=vue.js.map
