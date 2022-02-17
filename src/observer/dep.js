
//多对多的关系  一个属性有一个dep 用来收集watcher
// dep 可以存多个watcher
//一个watcher 可以对应多个dep
class Dep{
  constructor(){
    this.subs=[]
  }

  depend(){
     this.subs.push(Dep.target)
  }
  notify(){
    this.subs.forEach(watcher=>{watcher.update()})
  }
}
Dep.target=null
export function pushTarget(watcher){
  Dep.target = watcher
}

export function popTarget(watcher){
  Dep.target = null
}

export default Dep