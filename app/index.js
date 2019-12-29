const Koa = require('koa');
const bodyparser = require('koa-bodyparser');//接受post参数
const error = require('koa-json-error');//统一处理错误 
const parameter = require('koa-parameter');//校验参数
const mongoose = require('mongoose');//db
const routing = require('./routes');//所有路由
const {connectionStr} = require('./config');//所有路由
const app = new Koa();

mongoose.connect(connectionStr,{ useNewUrlParser: true,useUnifiedTopology: true },() => console.log('connect success...'))
mongoose.connection.on('error',() =>console.log('connect error...'))
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
})


app.use(error({
    postFormat: (e, { stack, ...rest }) => process.env.NODE_ENV === 'production' ? rest : { stack, ...rest }
}))
app.use(bodyparser())
app.use(parameter(app))
routing(app);


app.listen(3000, () => console.log('start...'));