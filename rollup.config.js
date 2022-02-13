import babel from 'rollup-plugin-babel'
import serve from 'rollup-plugin-serve'


export default {
  input:'./src/index.js',//入口文件
  output:{
    format: 'umd',//输出格式  模块化类型
    name:"Vue",//全局变量名字
    file:"dist/umd/vue.js",//输出的文件
    sourcemap:true,//转换前后的映射
  },
  plugin:[
    babel({
      exclude:"node_modules/**"
    }),
    serve({
      open:true,
      port:3000,
      contentBase:'',
      openPage:"/index.html"
    })
  ]
}