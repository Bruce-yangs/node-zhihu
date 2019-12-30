const jsonwebtoken = require('jsonwebtoken');
const User = require('../models/user');
const {secret} = require('../config');

class UserCtl {

  async checkOwner(ctx,next) {
    console.log(ctx.state.user);
    if (ctx.params.id !== ctx.state.user._id) {ctx.throw(403,'没有权限');}
    await next();
  }

  async find(ctx) {
    ctx.body = await User.find();
  }

  async findById(ctx) {
    const user = await User.findById(ctx.params.id);
    if (!user) {
      ctx.throw(404, '用户不存在');
    }
    ctx.body = user;
  }

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
    ctx.body = {msg:'新建成功',name:user.name};

  }

  async update(ctx) {
    ctx.verifyParams({
      name: {type: 'string', required: false},
      password: {type: 'string', required: false}
    });
    const user = await User.findByIdAndUpdate(ctx.params.id, ctx.request.body);
    user ? ctx.body = user : ctx.throw(404, '用户不存在')
  }

  async delete(ctx) {
    const user = await User.findByIdAndRemove(ctx.params.id);
    user ? ctx.body = {msg: '删除成功'} : ctx.throw(404, '用户不存在')

  }

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
    const token = jsonwebtoken.sign({_id, name},secret,{expiresIn: '1d'});
    ctx.body = { token };
  }


}

module.exports = new UserCtl();