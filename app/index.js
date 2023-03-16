const Koa = require('koa');
const koaBody = require('koa-body');//接受post参数
const error = require('koa-json-error');//统一处理错误 
const parameter = require('koa-parameter');//校验参数
const mongoose = require('mongoose');//db
const koaStatic = require('koa-static');//设置静态文件目录
const path = require('path');
const routing = require('./routes');//所有路由
const {connectionStr} = require('./config');//所有路由
const app = new Koa();

mongoose.connect(connectionStr, {
  useNewUrlParser: true, useUnifiedTopology: true,
  'useFindAndModify': false
}, () => console.log('connect success...连接成功'))
mongoose.connection.on('error', (e) => {
  console.log(e);
  console.log('connect error...')
})
/* app.use((ctx) => {
    ctx.body = 'Hellow World and zhihu';
})
 */

/*  拦截*/
/* const auth = async(ctx,next) => {
    if (ctx.url !=='/user') {    
        ctx.throw(401);
    }
    await next();
} */


/* router.get('/',auth,(ctx) => {
    ctx.body = '这是主页';
}) */


/*
//报错
app.use(async (ctx, next) => {
    try {
        await next();
    } catch (err) {
        console.log(err)
        ctx.status = err.status || err.statusCode || 500;
        ctx.body = {
            message: err.message
        };
    }
})*/

//设置静态目录 中间件生成图片链接
app.use(koaStatic(path.join(__dirname,'public')));

app.use(error({
  postFormat: (e, {stack, ...rest}) => process.env.NODE_ENV === 'production' ? rest : {stack, ...rest}
}))

app.use(koaBody({
  multipart: true,//支持文件格式
  formidable: {//上传到目录
    uploadDir: path.join(__dirname, '/public/uploads'),
    keepExtensions: true //保证拓展名称 如jpg png
  },
}))
app.use(parameter(app))
routing(app);


app.listen(3000, () => console.log('start...'));