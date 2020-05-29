'use strict';

const Controller = require('egg').Controller;

class UserController extends Controller {
  async info() {
    const { ctx } = this;
    const body = {
      code: 200,
      msg: 'success',
      data: { },
    };
    const userinfo = await ctx.helper.verifyaccessToken(ctx.request.headers.accesstoken);
    if (userinfo) {
      body.data.permissions = userinfo.permissions;
      body.data.userName = userinfo.userName;
      body.data.avatar = userinfo.avatar;
    } else {
      body.code = 402;
      body.msg = '登录失效，请重新登录';
    }
    ctx.body = body;
  }
  async login() {
    const { ctx, app } = this;

    const body = {
      code: 200,
      msg: 'success',
      data: {
        accessToken: 'admin-accessToken',
      },
    };
    if (!ctx.request.body.userName || !ctx.request.body.password) {
      body.code = 403;
      body.msg = '用户名/密码缺失！';
      ctx.body = body;
      return false;
    }
    const vabapidb = app.mongo.get('vabapi');
    const userinfo = await vabapidb.findOne('users', { query: ctx.request.body });
    if (userinfo) {
      body.data.accessToken = await ctx.helper.creataccessToken(userinfo);
    } else {
      body.code = 403;
      body.msg = '用户名或密码错误';
      delete body.data;
    }
    ctx.body = body;
  }
  async logout() {
    const { ctx } = this;
    const res = await ctx.helper.deleteaccessToken(ctx.request.headers.accesstoken);
    const body = {
      code: 200,
      msg: res,
    };
    ctx.body = body;
  }
}

module.exports = UserController;
