const Router = require('koa-router');
const router = new Router(); 
const usersRouter = new Router({prefix:'/users'});
const {index,upload} = require('../controllers/home');
router.get('/',index);

//上传路由
router.post('/upload',upload);
module.exports = router