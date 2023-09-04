const Topics = require('../models/topics');
const User = require('../models/user');
const Question = require('../models/questions');

class TopicsCtl {
  //校验是否是当前用户
  /*async checkOwner(ctx, next) {
    if (ctx.params.id !== ctx.state.user._id) {
      ctx.throw(403, '没有权限');
    }
    await next();
  }*/

  //校验是否有该用户
  async checkTopicExist(ctx, next) {
    const topic = await Topics.findById(ctx.params.id);
    if (!topic) {
      ctx.throw(404, '话题不存在');
    }
    await next();
  }

  //查找相关的话题数据
  async find(ctx) {    //Math.max(1,2,3) => 返回3 最大的     limit(10)只返回10条   skip(10) 跳过第一页的10条
    const {per_page = 10, page} = ctx.query;
    // const {per_page = 10, page} = ctx.query;
    const pageNum = Math.max(page * 1, 1) - 1;
    const perPage = Math.max(per_page * 1, 1);
    ctx.body = await Topics
    //.find({name:'上海'}) 精确搜索  .find({name:new RegExp(ctx.query.q)}) //模糊搜索
      .find({name: new RegExp(ctx.query.q)}).limit(perPage).skip(pageNum * perPage);
  }

  //查找某一个话题详情
  async findById(ctx) {
    //前端请求url http://xxxx?fields=locations;business
    const {fields = ''} = ctx.query;
    //RESTful API 过滤掉不需要的参数 select(‘ +locations +business’)  以空格+号 格式
    const selectFields = fields.split(';').filter(f => f).map(item => ' +' + item).join('');

    console.log('selectFields================================');
    console.log(selectFields);
    const topics = await Topics.findById(ctx.params.id).select(selectFields);
    if (!topics) {
      ctx.throw(404, '用户不存在');
    }
    ctx.body = topics;
  }

  //创建话题
  async create(ctx) {
    //统一校验参数 parameter verifyParams
    ctx.verifyParams({
      name: {type: 'string', required: true},//required 默认也为true
      avatar_url: {type: 'string', required: false},
      introduction: {type: 'string', required: false},
    });
    const {name} = ctx.request.body;
    const repeatedUser = await Topics.findOne({name});

    if (repeatedUser) {
        ctx.throw(409, '话题已经占用')
    }

    const topics = await new Topics(ctx.request.body).populate('name').save();
    ctx.body = topics;

  }

  //更新话题  相关参数信息
  async update(ctx) {
    ctx.verifyParams({
      name: {type: 'string', required: false},
      avatar_url: {type: 'string', required: false},
      introduction: {type: 'string', required: false},
    });
    const topics = await Topics.findByIdAndUpdate(ctx.params.id, ctx.request.body);
    topics ? ctx.body = topics : ctx.throw(404, '话题不存在')
  }

  //获取某用户的粉丝接口
  async listFollowers(ctx) {
    const user = await User.find({followingTopics: ctx.params.id});
    ctx.body = user;
  }
  //获取话题对应的问题
  async listQuestions(ctx) {
    const questions = await Question.find({topics: ctx.params.id});
    ctx.body = questions;
  }
}

module.exports = new TopicsCtl();