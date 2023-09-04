const Answers = require("../models/answers");
const User = require("../models/user");

class AnswersCtl {
  //校验是否是当前用户
  /*async checkOwner(ctx, next) {
    if (ctx.params.id !== ctx.state.user._id) {
      ctx.throw(403, '没有权限');
    }
    await next();
  }*/

  //校验是否有该用户
  async checkAnswerExist(ctx, next) {
    const answers = await Answers.findById(ctx.params.id).select("+answerer");
    if (!answers) {
      ctx.throw(404, "答案不存在");
    }
    //只有删、改、查 走该逻辑，  赞、踩时候不检查
    if (ctx.params.questionId && answers.questionId !== ctx.params.questionId) {
      ctx.throw(404, "该问题下没有此答案");
    }
    ctx.state.answer = answers;
    await next();
  }

  //更新问题  相关参数信息
  async checkAnswerer(ctx, next) {
    const { answer } = await ctx.state;
    if (answer.answerer.toString() !== ctx.state.user._id) {
      ctx.throw(403, "没有权限");
    }
    await next();
  }

  //查找相关的问题数据
  async find(ctx) {
    //Math.max(1,2,3) => 返回3 最大的     limit(10)只返回10条   skip(10) 跳过第一页的10条
    const { per_page = 10, page } = ctx.query;
    // const {per_page = 10, page} = ctx.query;
    const pageNum = Math.max(page * 1, 1) - 1;
    const perPage = Math.max(per_page * 1, 1);

    const q = new RegExp(ctx.query.q);
    ctx.body = await Answers.find({
      content: q,
      questionId: ctx.params.questionId,
    }) //模糊搜索  多项模糊搜索 $or: [{ title: q }, { description: q }]
      // .find({ $or: [{ title: q }, { description: q }] })
      .limit(perPage)
      .skip(pageNum * perPage);
  }

  //查找某一个问题详情
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
    const AnswersResult = await Answers.findById(ctx.params.id)
      .select(selectFields)
      .populate("answers");
    if (!AnswersResult) {
      ctx.throw(404, "问题不存在");
    }
    ctx.body = AnswersResult;
  }

  //创建问题
  async create(ctx) {
    //统一校验参数 parameter verifyParams
    ctx.verifyParams({
      content: { type: "string", required: true }, //required 默认也为true
    });
    // const { title } = ctx.request.body;
    // const repeatedUser = await Answers.findOne({ title });

    // if (repeatedUser) {
    //   ctx.throw(409, "问题已经占用");
    // }

    const answerer = ctx.state.user._id;
    const { questionId } = ctx.params;
    const answers = await new Answers({
      ...ctx.request.body,
      answerer,
      questionId,
    }).save();
    ctx.body = answers;
  }

  //更新问题  相关参数信息
  async update(ctx) {
    ctx.verifyParams({
      content: { type: "string", required: true }, //required 默认也为true
    });
    console.log(ctx.request.body);
    await ctx.state.answer.update(ctx.request.body);
    ctx.body = ctx.state.answer;
  }

  //删除问题  相关参数信息
  async delete(ctx) {
    await Answers.findByIdAndRemove(ctx.params.id);
    ctx.status = 204;
  }

  //获取某用户的粉丝接口
  // async listFollowers(ctx) {
  //   const user = await User.find({ followingAnswers: ctx.params.id });
  //   ctx.body = user;
  // }
}

module.exports = new AnswersCtl();
