import { generate } from "./generate"
import { parseHTML } from "./parse"

export function compileToFunctions(template) {
  // html模版 =》 render函数
  //1.将html代码转化成ast语法树
  //  <div id="app"></div>
  //  {
  //    attrs:[{id:'app'}],
  //    tag:'div',
  //    children:[]
  //  }
  let ast = parseHTML(template)
  // console.log(ast)

  // 2.通过ast语法树重新生成代码
   let code=generate(ast)
  // 3.将字符串转换成函数
  let render=new Function(`with(this){return ${code}}`)
  console.log(render);
  return render
}
