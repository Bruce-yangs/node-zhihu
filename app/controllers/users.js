const jsonwebtoken = require('jsonwebtoken');
const User = require('../models/user');
const {secret} = require('../config');

class UserCtl {
  //校验是否是当前用户
  async checkOwner(ctx, next) {
    if (ctx.params.id !== ctx.state.user._id) {
      ctx.throw(403, '没有权限');
    }
    await next();
  }
  //校验是否有该用户
  async checkUserExist(ctx, next) {
    const user = await User.findById(ctx.params.id);
    if (!user) {ctx.throw(404,'用户不存在');}
    await next();
  }

  //查找相关的列表数据
  async find(ctx) {
    ctx.body = await User.find();
  }

  //查找某一个用户详情
  async findById(ctx) {
    //前端请求url http://xxxx?fields=locations;business
    const {fields = 'bb'} = ctx.query;
    //RESTful API 过滤掉不需要的参数 select(‘ +locations +business’)  以空格+号 格式
    const selectFields = fields.split(';').filter(f => f).map(item => ' +' + item).join('');

    const user = await User.findById(ctx.params.id).select(selectFields);
    if (!user) {
      ctx.throw(404, '用户不存在');
    }
    ctx.body = user;
  }

  //创建账户
  async create(ctx) {
    //统一校验参数 parameter verifyParams
    ctx.verifyParams({
      name: {type: 'string', required: true},//required 默认也为true
      password: {type: 'string', required: true}
    });
    const {name} = ctx.request.body;
    const repeatedUser = await User.findOne({name});

    if (repeatedUser) {
      ctx.throw(409, '用户已经占用')
    }

    const user = await new User(ctx.request.body).save();
    ctx.body = {msg: '新建成功', name: user.name};

  }

  //更新相关参数信息
  async update(ctx) {
    ctx.verifyParams({
      name: {type: 'string', required: false},
      password: {type: 'string', required: false},
      avatar_url: {type: 'string', required: false},
      gender: {type: 'string', required: false},
      headline: {type: 'string', required: false},
      locations: {type: 'array', itemType: 'string', required: false},
      business: {type: 'string', required: false},
      employments: {type: 'array', itemType: 'object', required: false},
      educations: {type: 'array', itemType: 'object', required: false},
    });
    const user = await User.findByIdAndUpdate(ctx.params.id, ctx.request.body);
    user ? ctx.body = user : ctx.throw(404, '用户不存在')
  }

  //删除相关信息
  async delete(ctx) {
    const user = await User.findByIdAndRemove(ctx.params.id);
    user ? ctx.body = {msg: '删除成功'} : ctx.throw(404, '用户不存在')

  }

  //登陆校验及生成token
  async login(ctx) {
    ctx.verifyParams({
      name: {type: 'string', required: true},
      password: {type: 'string', required: true}
    });
    const user = await User.findOne(ctx.request.body);
    if (!user) {
      ctx.throw(401, '用户或密码不正确');
    }
    const {_id, name} = user;
    const token = jsonwebtoken.sign({_id, name}, secret, {expiresIn: '1d'});
    ctx.body = {token};
  }

  //获取某人关注的相关信息
  async listFollowing(ctx) {
    //populate('following')获取相关信息
    const user = await User.findById(ctx.params.id).select('+following').populate('following');
    console.log(user);
    if (!user) {
      ctx.throw(404);
    }
    ctx.body = user.following;
  }
  //获取某用户的粉丝接口
  async listFollowers(ctx) {
    const user = await User.find({following: ctx.params.id});
    ctx.body = user;
  }

  //关注某人
  async follow(ctx) {                       //populate('following')获取相关信息
    const me = await User.findById(ctx.state.user._id).select('+following');
    if (!me.following.map(id => id.toString()).includes(ctx.params.id)) {
      me.following.push(ctx.params.id);
      me.save();
    }
    ctx.status = 204;
  }

  //取消关注某人
  async unfollow(ctx) {                       //populate('following')获取相关信息
    const me = await User.findById(ctx.state.user._id).select('+following');
    const index = me.following.map(id => id.toString()).indexOf(ctx.params.id);
    if (index >-1) {
      me.following.splice(index,1);
      me.save();
    }
    ctx.status = 204;
  }

}

module.exports = new UserCtl();