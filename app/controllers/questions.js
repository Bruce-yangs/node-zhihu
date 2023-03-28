const Question = require("../models/questions");
const User = require("../models/user");

class QuestionCtl {
  //校验是否是当前用户
  /*async checkOwner(ctx, next) {
    if (ctx.params.id !== ctx.state.user._id) {
      ctx.throw(403, '没有权限');
    }
    await next();
  }*/

  //校验是否有该用户
  async checkQuestionExist(ctx, next) {
    const question = await Question.findById(ctx.params.id).select(
      "+questioner"
    );
    if (!question) {
      ctx.throw(404, "问题不存在");
    }
    ctx.state.question = question;
    await next();
  }

  //查找相关的话题数据
  async find(ctx) {
    //Math.max(1,2,3) => 返回3 最大的     limit(10)只返回10条   skip(10) 跳过第一页的10条
    const { per_page = 10, page } = ctx.query;
    // const {per_page = 10, page} = ctx.query;
    const pageNum = Math.max(page * 1, 1) - 1;
    const perPage = Math.max(per_page * 1, 1);

    const q = new RegExp(ctx.query.q);
    ctx.body = await Question.find({ name: new RegExp(ctx.query.q) }) //模糊搜索  多项模糊搜索 $or: [{ title: q }, { description: q }]
      .find({ $or: [{ title: q }, { description: q }] })
      .limit(perPage)
      .skip(pageNum * perPage);
  }

  //查找某一个话题详情
  async findById(ctx) {
    //前端请求url http://xxxx?fields=locations;business
    const { fields = "" } = ctx.query;
    //RESTful API 过滤掉不需要的参数 select(‘ +locations +business’)  以空格+号 格式
    const selectFields = fields
      .split(";")
      .filter((f) => f)
      .map((item) => " +" + item)
      .join("");

    console.log("selectFields================================");
    console.log(selectFields);
    const Question = await Question.findById(ctx.params.id).select(
      selectFields
    ).populate('questioner');
    if (!Question) {
      ctx.throw(404, "用户不存在");
    }
    ctx.body = Question;
  }

  //创建话题
  async create(ctx) {
    //统一校验参数 parameter verifyParams
    ctx.verifyParams({
      title: { type: "string", required: true }, //required 默认也为true
      description: { type: "string", required: false },
    });
    // const { title } = ctx.request.body;
    // const repeatedUser = await Question.findOne({ title });

    // if (repeatedUser) {
    //   ctx.throw(409, "问题已经占用");
    // }

    const Question = await new Question({
      ...ctx.request.body,
      questioner: ctx.state.user._id,
    })
      .populate("name")
      .save();
    ctx.body = Question;
  }

  //更新话题  相关参数信息
  async update(ctx) {
    ctx.verifyParams({
      title: { type: "string", required: true }, //required 默认也为true
      description: { type: "string", required: false },
    });
    await ctx.state.question.update(ctx.request.body);
    ctx.body = ctx.state.question;
  }

  //更新话题  相关参数信息
  async checkQuestioner(ctx, next) {
    const { question } = await ctx.state;
    if (question.questioner.toString() !== ctx.state.user._id) {
      ctx.throw(403, "没有权限");
    }
    await next();
  }

  //删除问题  相关参数信息
  async delete(ctx) {
    await Question.findByIdAndRemove(ctx.params.id);
    ctx.status = 204;
  }

  //获取某用户的粉丝接口
  async listFollowers(ctx) {
    const user = await User.find({ followingQuestion: ctx.params.id });
    ctx.body = user;
  }
}

module.exports = new QuestionCtl();
