const Router = require('koa-router');
const router = new Router(); 
const usersRouter = new Router({prefix:'/users'});
const {index} = require('../controllers/home');
router.get('/',index);
module.exports = router