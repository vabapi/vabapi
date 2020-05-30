'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    const a = { name: 'lidong', age: 32 };
    const b = ctx.helper.cloneObjectFn(a);
    b.sex = 'man';
    console.log('a:', a);
    console.log('b:', b);
    const dayjs = require('dayjs');
    console.log(dayjs().format('YYYY-MM-DD HH:mm:ss'));
    ctx.body = 'hi, egg';
  }
}

module.exports = HomeController;
