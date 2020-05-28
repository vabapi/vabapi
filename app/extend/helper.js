'use strict';

// app/extend/helper.js
const ObjectID = require('mongodb').ObjectId;

module.exports = {
  async   getObjectId(param) {
    return ObjectID(param);
  },
  async creataccessToken(userinfo) {
    // this 是 helper 对象，在其中可以调用其他 helper 方法res
    // this.ctx => context 对象
    // this.app => application 对象
    const jwt = await this.ctx.jwt.sign(userinfo, this.app.config.keys);
    const doc = { jwt, update_time: new Date() };
    const vabapidb = this.app.mongo.get('vabapi');
    const res = await vabapidb.insertOne('session', { doc });
    return res.insertedId;
  },
  async deleteaccessToken(accessToken) {
    const id = await this.getObjectId(accessToken);
    const vabapidb = this.app.mongo.get('vabapi');
    const res = await vabapidb.findOneAndDelete('session', { filter: { _id: id } });
    return !!res.value;
  },
  async verifyaccessToken(accessToken) {
    if (!accessToken) {
      return false;
    }
    const id = await this.getObjectId(accessToken);
    const vabapidb = this.app.mongo.get('vabapi');
    const res = await vabapidb.findOne('session', { query: { _id: id } });
    if (!res) {
      return false;
    }
    // jwt检验失败后返回false,什么情况下会失败呢？如有需要就取消下面这两行的注释^.^
    // const verify = await this.ctx.jwt.verify(res.jwt, this.app.config.keys);
    // if (!verify) { console.log('jwt检验失败'); return false; }
    const now = new Date();
    const datediff = now.getTime() - res.update_time.getTime();
    if (datediff / 1000 > this.app.config.vabapi.expirationPeriod) {
      // token过期，清除token
      vabapidb.findOneAndDelete('session', { filter: { _id: id } });
      return false;
    }
    vabapidb.findOneAndUpdate('session', { filter: { _id: id }, update: { $set: { update_time: now } } });
    const userinfo = await this.ctx.jwt.decode(res.jwt);
    return userinfo;
  },
};
