import {initMixin} from './init'
import { lifecycleMixin } from './lifecycle'
import { renderMixin } from './vdom/index'

function Vue(options){
  
  // console.log(options)
  this._init(options)
}

initMixin(Vue)
lifecycleMixin(Vue)
renderMixin(Vue)
export default Vue