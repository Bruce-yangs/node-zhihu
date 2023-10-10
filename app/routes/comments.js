const Router = require("koa-router");
const jwt = require("koa-jwt");
const router = new Router({ prefix: "/questions/:questionId/answers/:answerId/comments" }); // prefix 路由前缀
const {
  find,
  findById,
  create,
  update,
  checkCommentExist,
  checkCommentator,
  delete: del,
} = require("../controllers/comments");
const { secret } = require("../config");

//用koa-jwt 中间件 校验拦截
const auth = jwt({ secret });

//获取所有评论
router.get("/", find);

//新建评论
router.post("/", auth, create);

//查找某个评论
router.get("/:id", checkCommentExist, findById);

//put更新替换全部数据     patch只替换部分数据
router.patch("/:id", auth, checkCommentExist, checkCommentator, update);

router.delete("/:id", auth, checkCommentExist, checkCommentator, del);

module.exports = router;
