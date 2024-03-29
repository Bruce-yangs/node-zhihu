const Router = require('koa-router');
const jwt = require('koa-jwt');
const router = new Router({ prefix: '/questions' });// prefix 路由前缀
const { find, findById, create, update,checkQuestionExist,checkQuestioner, delete:del} = require('../controllers/questions');
const {secret} = require('../config');

//用koa-jwt 中间件 校验拦截
const auth = jwt({secret});

//获取所有问题
router.get('/', find);

//新建问题
router.post('/',auth, create);

//查找某个问题
router.get('/:id',checkQuestionExist, findById);

//put更新替换全部数据     patch只替换部分数据
router.patch('/:id',auth,checkQuestionExist,checkQuestioner,update);


router.delete('/:id',auth,checkQuestionExist,checkQuestioner,del);

module.exports = router;