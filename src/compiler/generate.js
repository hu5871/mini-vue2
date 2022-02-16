import { defaultTagRE } from './parse'

export function generate(ast) {
  // console.log(ast)
  let children = genChildren(ast)
  let code = `_c(${ast.tag},${ast.attrs.length ? genProps(ast.attrs) : undefined}${
    children ? `,${children}` : ''
  })`
  console.log(code)
  return code
}

function genProps(attrs) {
  console.log(attrs)
  let str = ''
  for (var i = 0; i < attrs.length; i++) {
    let attr = attrs[i]
    if (attr.name == 'style') {
      let obj = {}
      attr.value.split(';').forEach((item) => {
        let [key, value] = item.split(':')
        obj[key] = value
        attr.value = obj
      })
    }
    str += `${attr.name}:${JSON.stringify(attr.value)},`
  }
  return `{${str.slice(0, -1)}}`
}

function genChildren(ast) {
  const children = ast.children
  if (children) {
    return children.map((child) => gen(child)).join(',')
  }
}


function gen(node) {
  if (node.type === 1) {
    return generate(node)
  }
  if (node.type === 3) {
    let text = node.text
    if (!defaultTagRE.test(text)) {
      //  如果是普通文本： 不带{{}}
      return `_v(${JSON.stringify(text)})`
    }
    let tokens = [] //存放每一段代码
    let lastIndex = defaultTagRE.lastIndex = 0 //如果正则是全局模式 需要每次使用前置为零
    let match, index //每次匹配到的结果和匹配到的索引
    while ((match = defaultTagRE.exec(text))) {
      index = match.index
      // console.log(match)
      // console.log(lastIndex)
      if (index > lastIndex) {
        tokens.push(JSON.stringify(text.slice(lastIndex,index)))
      }
      tokens.push(`_s(${match[1].trim()})`)
      lastIndex = index + match[0].length
     
    }
    if (lastIndex < text.length) {
      tokens.push(JSON.stringify(text.slice(lastIndex)))
    }
    return `_v(${tokens.join("+")})`
  }
}
