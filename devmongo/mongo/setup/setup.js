db = db.getSiblingDB('vabapi'); // 创建一个名为"vabapi"的DB
db.createUser( // 创建一个名为"vabapi"的用户，设置密码和权限
  {
    user: 'vabapi',
    pwd: 'vabapi888',
    roles: [
      { role: 'dbOwner', db: 'vabapi' },
    ],
  }
);
db.createCollection('users'); // 在"vabapi"中创建一个名为"users"的Collection
const admin = {
  userName: 'admin',
  password: '123456',
  permissions: [ 'admin' ],
};
db.users.insert([ admin ]);
