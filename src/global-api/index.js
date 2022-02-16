import { mergeOptions } from "../util"

export function initGlobalApi(Vue){
  Vue.options = {}
  Vue.mixin=function (mixin){
    this.options=mergeOptions(this.options,mixin) //选项合并：把用户传进来的选贤合并到当前的options上
  }
}
