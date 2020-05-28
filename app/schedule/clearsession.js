'use strict';

module.exports = {
  schedule: {
    interval: '60m', // 60 分钟间隔
    type: 'worker', // 指定一个 worker 执行
    immediate: true,
  },
  async task(ctx) {
    const now = new Date();
    // console.log('now:', now);
    const deletedate = new Date(now.getTime() - ctx.app.config.vabapi.expirationPeriod * 1000);
    // console.log('deletedate:', deletedate);
    const vabapidb = ctx.app.mongo.get('vabapi');
    const res = await vabapidb.deleteMany('session', { filter: { update_time: { $lt: deletedate } } });
    ctx.logger.info('清除过期session:', res.result.n);
  },
};
