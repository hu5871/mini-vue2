import {initMixin} from './init'

function Vue(options){
  
  // console.log(options)
  this._init(options)
}

initMixin(Vue)
export default Vue