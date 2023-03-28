const Router = require('koa-router');
const jwt = require('koa-jwt');
// const jsonwebtoken = require('jsonwebtoken');
const {secret} = require('../config');
const {checkTopicExist} = require('../controllers/topics');

const router = new Router({ prefix: '/users' });// prefix 路由前缀
const { find, findById, create, update, delete:del,
  login, checkOwner,listFollowing,follow,unfollow,listFollowers,
  followTopic,unfollowTopic,listFollowingTopics,checkUserExist } = require('../controllers/users');

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

//获取所有用户
router.get('/', find);

//新建用户
router.post('/', create);

//查找某个用户
router.get('/:id', findById);

//put更新替换全部数据     patch只替换部分数据
router.patch('/:id',auth,checkOwner, update);

//删除用户
router.delete('/:id',auth,checkOwner, del);

//登录
router.post('/login', login);

//获取某用户关注信息
router.get('/:id/following', listFollowing);

//获取粉丝
router.get('/:id/followers', listFollowers);

//关注某用户
router.put('/following/:id',auth, checkUserExist, follow);

//取消关注
router.delete('/following/:id',auth, checkUserExist, unfollow);

//获取某用户关注话题
// router.get('/:id/followTopic', listFollowingTopics);
router.get('/:id/followingTopics', listFollowingTopics);


//关注话题
router.put('/followingTopics/:id',auth,checkTopicExist, followTopic);

//取消关注话题
router.delete('/followingTopics/:id',auth,checkTopicExist, unfollowTopic);

module.exports = router;