const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const router = express.Router();
// bodyParser.urlencoded({extended: false});
// bodyParser.json();

const os = require('os');
/* GET ip address */
function getIPAdress() {
  var interfaces = os.networkInterfaces();
  for (var devName in interfaces) {
    var iface = interfaces[devName];
    for (var i = 0; i < iface.length; i++) {
      var alias = iface[i];
      if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
        return alias.address;
      }
    }
  }
}
const baseURL = getIPAdress();
console.log(`http://${baseURL}:8085`)

/* create object to connect database */
const mysql = require('mysql')
const conn = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'starocean',
  timezone: "SYSTEM"
})

router.get('/getAddress', (req, res) => {
  res.send(baseURL)
})

/* product start */
/**
 * @api {get} /users 获取全部用户
 * @apiName GetUsers
 * @apiGroup User
 *
 * @apiParam {Null} Null Null
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "status": 0,
 *       "message": [
 *         {
 *           "u_id": 1,
 *           "u_name": "测试01",
 *           "u_pwd": "123456",
 *           "u_phone": "123456",
 *           "u_img": null
 *         },
 *         {
 *           "u_id": 2,
 *           "u_name": "测试02",
 *           "u_pwd": "654321",
 *           "u_phone": "123654",
 *           "u_img": null
 *         }
 *       ],
 *       "affectedRows": 0
 *     }
 */
router.get('/users',(req, res) => {
  const sqlStr = 'select * from users';
  conn.query(sqlStr, (err, results) => {
    console.log(err);
    if (err) return res.json({ status: 1, message: '获取数据失败', affectedRows: 0 })
    res.json({ status: 0, message: results, affectedRows: 0 })
  })
})

/**
 * @api {post} /loginuser 获取登录用户
 * @apiName LoginUser
 * @apiGroup User
 *
 * @apiParam {String} u_name 用户名称。
 * @apiParam {String} u_pwd 用户密码。
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "status": 0,
 *       "message": [
 *         {
 *           "u_id": 1,
 *           "u_name": "测试01",
 *           "u_phone": "123456",
 *           "u_img": null
 *         }
 *       ],
 *       "affectedRows": 0
 *     }
 */
router.post('/loginuser',bodyParser.urlencoded({extended: false}),(req, res) => {
  const body = [
    req.body.uname,
    req.body.upwd
  ];
  const sqlStr = 'select u_id,u_name,u_phone,u_himg from users where u_name = ? and u_pwd = ?';
  console.log(req.body);
  conn.query(sqlStr, body, (err, results) => {
    console.log(err);
    if (err || results.length === 0) return res.json({ status: 1, message: '用户名或密码错误', affectedRows: 0 })
    res.json({ status: 0, message: results, affectedRows: 0 })
  })
})
/**
 * @api {get} /user/:id 获取id对应用户
 * @apiName GetUser
 * @apiGroup User
 *
 * @apiParam {Number} id 用户id。
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "status": 0,
 *       "message": [
 *         {
 *           "u_id": 1,
 *           "u_name": "测试01",
 *           "u_pwd": "123456",
 *           "u_phone": "123456",
 *           "u_img": null
 *         }
 *       ],
 *       "affectedRows": 0
 *     }
 */
router.get('/user/:uid',(req, res) => {
  const uid = req.params.uid;
  const sqlStr = 'select * from users where u_id = ?';
  conn.query(sqlStr, uid, (err, results) => {
    console.log(err);
    if (err) return res.json({ status: 1, message: '获取用户失败', affectedRows: 0 })
    res.json({ status: 0, message: results, affectedRows: 0 })
  })
})

/**
 * @api {post} /user 创建用户
 * @apiName PostUser
 * @apiGroup User
 *
 * @apiParam {String} u_name 用户名称。
 * @apiParam {String} u_pwd 用户密码。
 * @apiParam {String} u_phone 用户手机号。
 * @apiParam {String} u_himg 用户头像路径。
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "status": 0,
 *       "message": [
 *         {
 *           "u_id": 1,
 *           "u_name": "测试01",
 *           "u_pwd": "123456",
 *           "u_phone": "123456",
 *           "u_img": null
 *         }
 *       ],
 *       "affectedRows": 0
 *     }
 */
router.post('/user',(req, res) => {
  const body = req.body;
  const sqlStr = 'insert into users set ?';
  conn.query(sqlStr, body, (err, results) => {
      if (err) return res.json({ status: 1, message: '用户已被注册', affectedRows: 0 })
      res.json({ status: 0, message: results, affectedRows: results.affectedRows })
  })
})
/**
 * 编辑用户 put
 */
router.put('/user/:uid',(req, res) => {
  const uid = req.params.uid;
  const body = req.body;
  const sqlStr = 'update users set ? where u_id = ?';
  conn.query(sqlStr, {body, uid}, (err, results) => {
    console.log(err);
    if (err) return res.json({ status: 1, message: '编辑用户失败', affectedRows: 0 })
    res.json({ status: 0, message: results, affectedRows: results.affectedRows })
  })
})

/**
 * 获取走马灯
 */
router.get('/informations',(req, res) => {
  const sqlStr = 'SELECT * FROM informations';
  conn.query(sqlStr, (err, results) => {
    if (err) return res.json({ status: 1, message: '获取轮播图失败', affectedRows: 0 })
    results.forEach(item => {
      if (item.i_img.length > 0) {
        item.i_img = `http://${baseURL}:8085${item.i_img}`;
      }
    })
    res.json({ status: 0, message: results, affectedRows: 0 })
  })
})
/**
 * 获取所有作品
 */
router.get('/designs',(req, res) => {
  let start = ((req.query.dsindex || 1) - 1) * 2;
  const limit = req.query.limit || 3
  const sqlStr1 = 'SELECT * FROM designs limit ' + start + ',' + limit + ' ';
  const sqlStr2 = 'SELECT count(*) FROM designs';
  conn.query(sqlStr1, (err1, results1) => {
    results1.forEach(item => {
      if (item.ds_cover.length > 0) {
        item.ds_cover = `http://${baseURL}:8085${item.ds_cover}`;
      }
    })
    conn.query(sqlStr2, (err2, results2) => {
      if (err1) return res.json({ status: 1, message: '获取数据失败', affectedRows: 0 })
      res.json({ status: 0, message: results1, count: results2[0]['count(*)'], affectedRows: 0 })
    })
  })
})

/**
 * 获取id对应作品 get
 */
router.get('/designs/:dsid',(req, res) => {
  const dsid = req.params.dsid;
  const sqlStr = 'select * from designs where ds_id = ?';
  conn.query(sqlStr, dsid, (err, results) => {
    console.log(err);
    if (err) return res.json({ status: 1, message: '获取数据失败', affectedRows: 0 })
    res.json({ status: 0, message: results, affectedRows: 0 })
  })
})

/**
 * 添加作品 post
 */
router.post('/design',(req, res) => {
  const body = req.body;
  const sqlStr = 'insert into designs set ?';
  conn.query(sqlStr, body, (err, results) => {
    console.log(err);
    if (err) return res.json({ status: 1, message: '上传作品失败', affectedRows: 0 })
    res.json({ status: 0, message: results, affectedRows: 0 })
  })
})

/**
 * 获取id对应作品下的所有评论
 */
router.get('/comments/:dsid',(req, res) => {
  const dsid = req.params.dsid;
  const sqlStr = 'select * from designs where ds_id = ?';
  conn.query(sqlStr, dsid, (err, results) => {
    console.log(err);
    if (err) return res.json({ status: 1, message: '获取评论失败', affectedRows: 0 })
    res.json({ status: 0, message: results, affectedRows: 0 })
  })
})

/**
 * 作品下发表评论
 */
router.post('/comments',(req, res) => {
  const body = req.body;
  const sqlStr = 'insert into comments set ?';
  conn.query(sqlStr, body, (err, results) => {
    console.log(err);
    if (err) return res.json({ status: 1, message: '发表评论失败', affectedRows: 0 })
    res.json({ status: 0, message: results, affectedRows: 0 })
  })
})

/* product end */

/* GET home page. */
router.get('/', function(req, res, next) {
  // res.render('index', { title: 'Express' });
  res.sendFile(path.join(__dirname, './index.html'));
});

module.exports = router;
