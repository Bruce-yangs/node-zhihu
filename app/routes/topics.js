const Router = require('koa-router');
const jwt = require('koa-jwt');
const router = new Router({ prefix: '/topics' });// prefix 路由前缀
const { find, findById, create, update,listFollowers,checkTopicExist,listQuestions, delete:del} = require('../controllers/topics');
const {secret} = require('../config');

//用koa-jwt 中间件 校验拦截
const auth = jwt({secret});

//获取所有用户
router.get('/', find);

//新建用户
router.post('/',auth, create);

//查找某个用户
router.get('/:id',checkTopicExist, findById);

//put更新替换全部数据     patch只替换部分数据
router.patch('/:id',auth,checkTopicExist,update);

//获取关注该话题的 用户列表
router.get('/:id/followers',checkTopicExist,listFollowers);

//获取话题下的相关问题
router.get('/:id/questions',checkTopicExist,listQuestions);



module.exports = router;