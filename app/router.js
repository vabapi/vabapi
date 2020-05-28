'use strict';
// filePath: app/router.js
// 全局变量定义 方法object对象
global.actionObject = {};

// 实现方法Object.keys(controller[item]) == 0 时,为控制下具体方法,直接加入到actionObject集合,>0说明是多级控制器,继续遍历
function getAction(controller, path) {
  const controllerArray = Object.keys(controller);
  controllerArray.forEach(item => {
    const newPath = path + '/' + item;
    if (Object.keys(controller[item]).length > 0) {
      getAction(controller[item], newPath);
    } else {
      global.actionObject[newPath] = controller[item];
    }
  });
}

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  getAction(controller, '');
  // 得到actionObject的key数组
  const actionArray = Object.keys(global.actionObject);
  // 遍历加入到路由
  actionArray.forEach(item => {
    // 自动实现路由指向方法 需要哪种请求头任意添加
    router.get(item, global.actionObject[item]);
    router.post(item, global.actionObject[item]);
  });
  // 这里可以继续添加方法,不冲突

  router.get('/', controller.home.index);
  router.post('/api/login', controller.api.user.login);
  router.post('/api/logout', controller.api.user.logout);
};
