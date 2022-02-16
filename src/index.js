import { initGlobalApi } from './global-api/index'
import {initMixin} from './init'
import { lifecycleMixin } from './lifecycle'
import { renderMixin } from './vdom/index'

function Vue(options){
  
  // console.log(options)
  this._init(options)
}

//原型方法
initMixin(Vue)
lifecycleMixin(Vue)
renderMixin(Vue)

//静态方法
initGlobalApi(Vue)
export default Vue