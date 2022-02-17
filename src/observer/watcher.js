import { popTarget, pushTarget } from "./dep";

let uid = 0;
class Watcher{
  constructor(vm,expOrFn,cb,option){
    this.vm=vm;
    this.expOrFn=expOrFn;
    this.cb=cb;
    this.option=option;
    this.id=++uid;//watcher唯一标识

    if(typeof expOrFn === 'function'){
      this.getter=expOrFn
    }
    this.get()
  }
  get(){
     pushTarget(this)
     this.getter()
     popTarget() 
  }
  updata(){
    this.get()
  }
}

export default Watcher 