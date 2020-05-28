'use strict';

module.exports = appInfo => {
  const config = {};

  /**
   * @member Config#
   * @property {String} KEY - description
   */
  // {app_root}/config/config.default.js
  config.mongo = {
    clients: {
      vabapi: {
        host: '127.0.0.1',
        port: '27017',
        name: 'vabapi',
        user: 'vabapi',
        password: 'vabapi888',
        options: {},
      },
    },
  };

  return config;
};
