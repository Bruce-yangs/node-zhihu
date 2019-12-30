const Router = require('koa-router');
const jwt = require('koa-jwt');
// const jsonwebtoken = require('jsonwebtoken');
const {secret} = require('../config');

const router = new Router({ prefix: '/users' });
const { find, findById, create, update, delete:del, login, checkOwner } = require('../controllers/users');

/* 自己写的 中间件 校验拦截*/
/* const auth = async(ctx,next) => {
   //做兼容 当authorization没有设置的时候默认为空
   const {authorization = ''} = ctx.request.header;
   //获取token
   const token = authorization.replace('Bearer ','');
   try {
      const user = jsonwebtoken.verify(token,secret);
      ctx.state.user = user;
      console.log(user);

    } catch (err) {
      ctx.throw(401,err.message)
    }
    await next();
}*/

//用koa-jwt 中间件 校验拦截
const auth = jwt({secret});

router.get('/', find);

router.post('/', create);

router.get('/:id', findById);

//put更新替换全部数据     patch只替换部分数据
router.patch('/:id',auth,checkOwner, update);

router.delete('/:id',auth,checkOwner, del);

router.post('/login', login);

module.exports = router;