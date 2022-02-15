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
  console.log(ast)
  // 2.通过ast语法树重新生成代码
}

const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*` // 匹配标签名 <aa-aa>
const qnameCapture = `((?:${ncname}\\:)?${ncname})` //
const startTagOpen = new RegExp(`^<${qnameCapture}`) //标签开头的正则 捕获的内容是标签名
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`) //匹配标签结尾的 </div>
const attribute =
  /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/ //匹配属性的 a="a" a='a' a=a
const startTagClose = /^\s*(\/?)>/ //匹配标签结束的 >
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g // {{ xxx }}

function parseHTML(html) {
  let root
  let currentParent
  let stack=[]
  function createASTElement(tagName, attrs) {
    return {
      tag: tagName,//标签名
      type: 1,//元素类型
      children: [],//子元素列表
      attrs,//属性列表
      parent: null,//父元素
    }
  }

  function start(tagName, attrs) {
    // console.log('start',tagName,attrs)
    const element = createASTElement(tagName, attrs)
    if(!root){
      root = element
    }
    currentParent=element;//保存当前解析的标签
    stack.push(element)
  }
  function end(tagName) {
    // console.log('end', tagName)
  //   <div id="app"><p></p> hello </div>
  console.log(stack)
   const element= stack.pop();//
    currentParent=stack[stack.length-1]//取出栈中的最后一个
    if(currentParent){
        element.parent=currentParent
        currentParent.children.push(element)
    }
    console.log(stack)
  }
  function chars(text) {
    // console.log('text', text)
    text=text.trim()
    if(text){
      console.log(currentParent)
      currentParent.children.push({
        type:3,//文本类型
        text
      })
    }
  }
  while (html) {
    let textEnd = html.indexOf('<')
    if (textEnd === 0) {
      //是标签
      const startTagMatch = parseStartTag() //处理开始
      if (startTagMatch) {
        start(startTagMatch.tagName, startTagMatch.attrs)
        continue
      }
      const endTagMatch = html.match(endTag) //匹配到结束标签
      console.log('endTagMatch',endTagMatch)
      // break
      if (endTagMatch) {
        //处理结束标签
        advance(endTagMatch[0].length)
        end(endTagMatch[1])
        continue
      }
    }
    let text
    if (textEnd >= 0) {
      //处理文本
      text = html.substring(0, textEnd)
    }
    if (text) {
      //有文本处理文本
      // 删掉html中的文本
      advance(text.length)
      chars(text)
    }
  }
  function advance(n) {
    //  index+=n;
    html = html.substring(n) //将字符串进行截取操作
  }

  function parseStartTag() {
    let start = html.match(startTagOpen) //匹配标签开头
    if (start) {
      const match = {
        tagName: start[1],
        attrs: [],
        // start:index
      }
      advance(start[0].length) //删除开始标签

      // 如果是闭合标签 说明没有属性，所以每次循环都要判断一下
      let end, attr

      // 不是结尾标签 并且能拿到属性
      while (
        !(end = html.match(startTagClose)) &&
        (attr = html.match(attribute))
      ) {
        // 假设 我们的 元素是这的 <div id="id">hello vue2</div>
        // attribute正则 逐步分析得到的数据
        // s*([^\s"'<>\/=]+)： s* 匹配连续的空格 ^\s 不是空格 "'<>不是双引或者单引 +前面的子表达式匹配多次 后面的正则基本就是匹配双引号、单引号、没有引号这三种分组情况，分别返回它们的所在分组匹配结果
        // console.log(attr)
        match.attrs.push({
          name: attr[1], //attr是   {0:" id="app "",1:"id",2:"=",3:"app",4:'app',5:app}这样的对象，它345只会出现一种情况，因为你不能是id="app'  这样的双｜单引号结尾
          value: attr[3] || attr[4] || attr[5],
        })
        // 匹配完截取html
        advance(attr[0].length)
      }
      if (end) {
        //最后匹配到>号，把它删掉
        advance(end[0].length)
        return match
      }
    } else {
    }
  }
  return root
}
