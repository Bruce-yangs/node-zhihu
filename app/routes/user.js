const Router = require('koa-router');
const router = new Router({ prefix: '/users' });
const { find, findById, create, update, delete:del } = require('../controllers/users');

router.get('/', find);

router.post('/', create);

router.get('/:id', findById);

//put更新替换全部数据     patch只替换部分数据
router.put('/:id', update);

router.delete('/:id', del);

module.exports = router;