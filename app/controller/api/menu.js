'use strict';

const Controller = require('egg').Controller;

class MenuController extends Controller {
  async navigate() {
    const { ctx } = this;
    ctx.body = {
      code: 200,
      msg: 'ok',
      data: [],
    };

  }
}

module.exports = MenuController;
