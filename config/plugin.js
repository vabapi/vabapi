'use strict';

/** @type Egg.EggPlugin */
module.exports = {
  // had enabled by egg
  // static: {
  //   enable: true,
  // }
  mongo: {
    enable: true,
    package: 'egg-mongo-native',
  },
  jwt: {
    enable: true,
    package: 'egg-easy-jwt',
  },
  cors: {
    enable: true,
    package: 'egg-cors',
  },
  validate: {
    enable: true,
    package: 'egg-validate',
  },

};
