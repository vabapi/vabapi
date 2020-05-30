'use strict';
const Collection = 'roles';
const Controller = require('egg').Controller;

class RoleManagementController extends Controller {
  async getList() {
    const { ctx, app } = this;
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
    const allowroles = [ 'admin' ]; // 定义允许使用本接口的角色数组
    if (allowroles.filter(v => userinfo.permissions.includes(v)).length === 0) {
      ctx.body = {
        code: 403,
        msg: '操作失败，您未被授权进行当前操作！',
      };
      return;
    }
    /* 用户身份验证结束 */
    /* 请求体校验 */
    const request = ctx.request.body;
    console.log(request);
    const errs = app.validator.validate(
      {
        permission: 'string?',
        pageNo: 'number',
        pageSize: 'number',
      },
      request);
    if (errs) {
      ctx.body = {
        code: 400,
        msg: errs,
      };
      return;
    }
    /* 请求体校验结束 */
    const body = {
      code: 200,
      data: [],
      msg: 'success',
      totalCount: 0,
    };
    const query = {};
    if (request.permission) { query.permission = request.permission; }
    const vabapidb = app.mongo.get('vabapi');
    body.totalCount = await vabapidb.countDocuments(Collection, { query });
    body.data = await vabapidb.find(Collection, {
      query,
      projection: { _id: 0 },
      skip: (request.pageNo - 1) * request.pageSize,
      limit: request.pageSize,

    });
    ctx.body = body;

  }
  async doEdit() {
    const { ctx, app } = this;
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
    const allowroles = [ 'admin' ]; // 定义允许使用本接口的角色数组
    console.log(allowroles.filter(v => userinfo.permissions.includes(v)).length === 0);
    if (allowroles.filter(v => userinfo.permissions.includes(v)).length === 0) {
      ctx.body = {
        code: 403,
        msg: '操作失败，您未被授权进行当前操作！',
      };
      return;
    }
    /* 用户身份验证结束 */
    /* 请求体校验 */
    const request = ctx.request.body;
    console.log(request);
    const errs = app.validator.validate(
      {
        id: 'string?',
        permission: 'string',
      },
      request);
    if (errs) {
      ctx.body = {
        code: 400,
        msg: errs,
      };
      return;
    }
    /* 请求体校验结束 */
    const body = {
      code: 400,
      msg: '未知的请求错误',
    };
    const vabapidb = app.mongo.get('vabapi');
    const dayjs = require('dayjs');

    if (request.id) {
      // 请求体包含id字段，说明是编辑
      if (await ctx.helper.isRepeat(Collection, { permission: request.permission, id: { $ne: request.id } }) > 0) {
        ctx.body = {
          code: 400,
          msg: '权限码已存在！',
        };
        return;
      }
      const $set = ctx.helper.cloneObjectFn(request);
      delete $set._id; // 不许修改系统 '_id' 字段
      $set.datatime = dayjs().format('YYYY-MM-DD HH:mm:ss'); // 数据更新时间
      const res = await vabapidb.findOneAndUpdate(Collection, {
        filter: { id: request.id },
        update: { $set },
      });
      console.log(res.lastErrorObject.updatedExisting);
      if (res.lastErrorObject.updatedExisting) {
        body.code = 200;
        body.msg = '更新成功!';
      } else {
        body.code = 400;
        body.msg = '更新失败，该数据可能已被删除！';
      }
    } else {
      if (await ctx.helper.isRepeat(Collection, { permission: request.permission }) > 0) {
        ctx.body = {
          code: 400,
          msg: '权限码已存在！',
        };
        return;
      }
      const doc = ctx.helper.cloneObjectFn(request);
      delete doc._id;
      doc.id = ctx.helper.creatUUID();
      doc.datatime = dayjs().format('YYYY-MM-DD HH:mm:ss'); // 数据更新时间
      const res = await vabapidb.insertOne(Collection, { doc });
      console.log(res.result.ok);
      if (res.result.ok === 1) {
        body.code = 200;
        body.msg = '增加成功!';
      }
    }
    ctx.body = body;
  }
  async doDelete() {
    const { ctx, app } = this;
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

    const allowroles = [ 'admin' ]; // 定义允许使用本接口的角色数组
    console.log(allowroles.filter(v => userinfo.permissions.includes(v)).length === 0);
    if (allowroles.filter(v => userinfo.permissions.includes(v)).length === 0) {
      ctx.body = {
        code: 403,
        msg: '操作失败，您未被授权进行当前操作！',
      };
      return;
    }
    /* 用户身份验证结束 */
    /* 请求体校验 */
    const request = ctx.request.body;
    console.log(request);
    const errs = app.validator.validate(
      {
        ids: 'string',
      },
      request);
    if (errs) {
      ctx.body = {
        code: 400,
        msg: errs,
      };
      return;
    }
    /* 请求体校验结束 */
    const ids = request.ids.split(',');
    const vabapidb = app.mongo.get('vabapi');
    for (let i = 0; i < ids.length; i++) {
      await vabapidb.findOneAndDelete(Collection, { filter: { id: ids[i] } });
    }
    ctx.body = {
      code: 200,
      msg: '删除成功！',
    };
  }
}

module.exports = RoleManagementController;
