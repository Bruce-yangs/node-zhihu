const Router = require("koa-router");
const jwt = require("koa-jwt");
const router = new Router({ prefix: "/questions/:questionId/answers" }); // prefix 路由前缀
const {
  find,
  findById,
  create,
  update,
  checkAnswerExist,
  checkAnswerer,
  delete: del,
} = require("../controllers/answers");
const { secret } = require("../config");

//用koa-jwt 中间件 校验拦截
const auth = jwt({ secret });

//获取所有问题
router.get("/", find);

//新建问题
router.post("/", auth, create);

//查找某个问题
router.get("/:id", checkAnswerExist, findById);

//put更新替换全部数据     patch只替换部分数据
router.patch("/:id", auth, checkAnswerExist, checkAnswerer, update);

router.delete("/:id", auth, checkAnswerExist, checkAnswerer, del);

module.exports = router;
