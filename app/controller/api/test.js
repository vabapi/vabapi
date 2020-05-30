'use strict';

const Controller = require('egg').Controller;

class TestController extends Controller {
  async getList() {
    const { ctx } = this;
    /* 用户身份验证：
    如果验证成功则会生成'userinfo',为一个Json对象，内容是users表里当前用户对应记录。
    后续判断可以直接使用 userinfo.name 方式调用，方便后续业务逻辑。
    */
    const userinfo = await ctx.helper.verifyaccessToken(ctx.request.headers.accesstoken);
    if (!userinfo) {
      ctx.body = {
        code: 402,
        msg: '登录失效，请重新登录！',
      };
      return;
    }
    /* 用户身份验证结束 */
    const request = ctx.request.body;
    console.log(request);

  }
}

module.exports = TestController;
