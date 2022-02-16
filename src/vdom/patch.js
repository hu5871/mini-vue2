export function patch(oldVnode, vnode) {
  // 将虚拟节点转换成真实节点

  const el = createElm(vnode) //产生真实的dom
  let parentNode = oldVnode.parentNode //获取老的app的父元素 》 body

  parentNode.insertBefore(el, oldVnode.nextSibling) //当前的真实元素插入到app的后面
  parentNode.removeChild(oldVnode) //删除老的节点
}

function createElm(vnode) {
  const { tag, children, key, data, text } = vnode
  // console.log(vnode)
  if (typeof tag === 'string') {
    vnode.el = document.createElement(tag)

    updateProperties(vnode)
    children.forEach((child) => {
      vnode.el.appendChild(createElm(child))
    })
  } else {
    vnode.el = document.createTextNode(text)
  }
  return vnode.el
}


function updateProperties(vnode){
  let el=vnode.el
  let newProps=vnode.data || {}
  for (const key in newProps) {
    if(key === 'style') {
      for (const styleName in newProps[key]) {
         el.style[styleName]=newProps.style[styleName]
      }
    }else if(key=== "class"){
      console.log(key);
      console.log(newProps);
      el.className=newProps[key]
    }else{
      el.setAttribute(key,newProps[key])
    }
  
  }
}