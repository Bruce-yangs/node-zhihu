const Comments = require("../models/comments");
const User = require("../models/user");

class CommentsCtl {
  //校验是否是当前用户
  /*async checkOwner(ctx, next) {
    if (ctx.params.id !== ctx.state.user._id) {
      ctx.throw(403, '没有权限');
    }
    await next();
  }*/

  //校验是否有该用户
  async checkCommentExist(ctx, next) {
    const comment = await Comments.findById(ctx.params.id).select("+commentator");
    if (!comment) {
      ctx.throw(404, "评论不存在");
    }
    //只有删、改、查 走该逻辑，  
    if (
      ctx.params.questionId &&
      comment.questionId.toString() !== ctx.params.questionId.toString()
    ) {
      ctx.throw(404, "该问题下没有此答案");
    }
    if (
      ctx.params.answerId &&
      comment.answerId.toString() !== ctx.params.answerId.toString()
    ) {
      ctx.throw(404, "该问题下没有此答案");
    }
    ctx.state.comment = comment;
    await next();
  }

  //更新问题  相关参数信息
  async checkCommentator(ctx, next) {
    const { comment } = await ctx.state;
    if (comment.commentator.toString() !== ctx.state.user._id) {
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
    const { questionId, answerId } = ctx.query.q;
    ctx.body = await Comments.find({
      content: q,
      questionId, answerId
    }) //模糊搜索  多项模糊搜索 $or: [{ title: q }, { description: q }]
      // .find({ $or: [{ title: q }, { description: q }] })
      .limit(perPage)
      .skip(pageNum * perPage)
      .populate("commentator");
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
    const commentsResult = await Comments.findById(ctx.params.id)
      .select(selectFields)
      .populate("commentator");
    if (!commentsResult) {
      ctx.throw(404, "评论人不存在");
    }
    ctx.body = commentsResult;
  }

  //创建问题
  async create(ctx) {
    //统一校验参数 parameter verifyParams
    ctx.verifyParams({
      content: { type: "string", required: true }, //required 默认也为true
    });
    // const { title } = ctx.request.body;
    // const repeatedUser = await Comments.findOne({ title });

    // if (repeatedUser) {
    //   ctx.throw(409, "问题已经占用");
    // }

    const commentator = ctx.state.user._id;
    const { questionId } = ctx.params;
    const comment = await new Comments({
      ...ctx.request.body,
      commentator,
      questionId,
      answerId,
    }).save();
    ctx.body = comment;
  }

  //更新问题  相关参数信息
  async update(ctx) {
    ctx.verifyParams({
      content: { type: "string", required: true }, //required 默认也为true
    });
    console.log(ctx.request.body);
    await ctx.state.comment.update(ctx.request.body);
    ctx.body = ctx.state.comment;
  }

  //删除问题  相关参数信息
  async delete(ctx) {
    await Comments.findByIdAndRemove(ctx.params.id);
    ctx.status = 204;
  }

  //获取某用户的粉丝接口
  // async listFollowers(ctx) {
  //   const user = await User.find({ followingcomments: ctx.params.id });
  //   ctx.body = user;
  // }
}

module.exports = new CommentsCtl();
