const User = require('../models/user');

class UserCtl {
    async find(ctx) {
        ctx.body = await User.find();
    }

    async findById(ctx) {
       const user = await User.findById(ctx.params.id);
        if (!user) {
           ctx.throw(404,'用户不存在');    
        }
        ctx.body = user;
    }

    async create(ctx) {
        //统一校验参数 parameter verifyParams
        ctx.verifyParams({
            name: { type: 'string', required: true },//required 默认也为true
            password: { type: 'string', required: true }
        });
        const {name} = ctx.request.body;
        const repeatedUser = await User.findOne({name});

        if (repeatedUser) {ctx.throw(409,'用户已经占用')}

        const user = await new User(ctx.request.body).save();
        ctx.body = user;

    }

    async update(ctx) {
        ctx.verifyParams({
            name: { type: 'string', required: false },
            password: { type: 'string', required: false }
        });
        const user = await User.findByIdAndUpdate(ctx.params.id,ctx.request.body);
        user ? ctx.body = user : ctx.throw(404,'用户不存在')
    }

    async delete(ctx) {
        const user = await User.findByIdAndRemove(ctx.params.id);
        user ? ctx.body = {msg:'删除成功'} : ctx.throw(404,'用户不存在')

    }


}
module.exports = new UserCtl();