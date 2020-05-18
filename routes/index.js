const express = require('express');
const path = require('path');
const nodemailer = require('nodemailer');
const fs = require('fs');
const marked = require('marked');

const router = express.Router();

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

/* 邮箱验证 */
const sendmail = {
  config: {
    host: "smtp.qq.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: '328121621@qq.com', // generated ethereal user
      pass: 'hrrqbcvzlclzbgfj' // generated ethereal password
    }
  },
  get transporter() {
    return nodemailer.createTransport(this.config);
  },
  get verify() {
    return Math.random().toString().substring(2, 8);
  },
  get time() {
    return Date.now();
  }
}

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
 *           "u_email": "123456",
 *           "u_img": null
 *         },
 *         {
 *           "u_id": 2,
 *           "u_name": "测试02",
 *           "u_pwd": "654321",
 *           "u_email": "123654",
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
 * @api {post} /user/login 获取登录用户
 * @apiName UserLogin
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
 *           "u_email": "123456",
 *           "u_img": null
 *         }
 *       ],
 *       "affectedRows": 0
 *     }
 */
router.post('/user/login',(req, res) => {
  const body = [
    req.body.uname,
    req.body.upwd
  ];
  const sqlStr = 'select u_id,u_name,u_himg from users where u_name = ? and u_pwd = ?';
  conn.query(sqlStr, body, (err, results) => {
    if (err || results.length <= 0) return res.json({ status: 1, message: '用户名或密码错误', affectedRows: 0 })
    if (results[0].u_himg) results[0].u_himg = `http://${baseURL}:8085${results[0].u_himg}`;
    req.session.islogin = true
    req.session.logid = results[0].u_id
    return res.json({ status: 0, message: results})
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
 *           "u_himg": url
 *         }
 *       ],
 *       "affectedRows": 0
 *     }
 */
router.get('/user',(req, res) => {
  const uid = req.session.logid || req.query.uid || 0;
  const sqlStr = 'select u_id,u_name,u_himg from users where u_id = ?';
  conn.query(sqlStr, uid, (err, results) => {
    if (err) return res.json({ status: 1, message: '用户不存在', affectedRows: 0 })
    if (!req.session.islogin) return res.json({ status: 1, message: '请先登录', affectedRows: 0 })
    results[0].u_himg = `http://${baseURL}:8085${results[0].u_himg}`
    return res.json({ status: 0, message: results, affectedRows: 0 })
  })
})
/* 退出登录 */
router.get('/user/loginout',(req, res) => {
  req.session.destroy();
  return res.redirect('/');
})

/**
 * @api {post} /user 创建用户
 * @apiName PostUser
 * @apiGroup User
 *
 * @apiParam {String} u_name 用户名称。
 * @apiParam {String} u_pwd 用户密码。
 * @apiParam {String} u_email 用户邮箱。
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "status": 0,
 *       "message": [
 *         "注册成功"
 *       ],
 *       "affectedRows": 0
 *     }
 */
router.post('/user',(req, res) => {
  const body = req.body;
  const verifynum = req.body.uecode
  const sqlStr = 'insert into users set ?';

  console.log(verifynum,req.session.verifycode);
  if (verifynum !== req.session.verifycode) return res.json({ status: 1, message: '验证码错误', affectedRows: 0 })
  conn.query(sqlStr, body, (err, results) => {
    if (err) return res.json({ status: 1, message: '用户已被注册', affectedRows: 0 })
    req.session.loguid = results[0].insertId
    res.json({ status: 0, message: results[0].insertId, affectedRows: results.affectedRows })
  })
})
router.get('/email',async(req, res) => {
  const uemail = req.query.uemail;
  const verifyNum = sendmail.verify;
  let options = {
    from: '328121621@qq.com', // sender address
    to: uemail, // list of receivers
    subject: "星海starocean 验证码", // Subject line
    text: "验证码："+verifyNum, // plain text body
    html: "<b>验证码："+verifyNum+"</b>" // html body
  };
  await sendmail.transporter.sendMail(options, (err, info)=>{
    if (info) {
      req.session.verifycode = verifyNum.toString();
      console.log('邮箱发送成功后session::',req.session);
      return res.json({ status: 0, message: '发送成功'})
    }
    return res.json({ status: 1, message: '发送失败'})
  });
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
  const limit = req.query.limit || 5
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
router.get('/design',(req, res) => {
  const dsid = req.query.dsid;
  console.log(req.query);
  const sqlStr = 'select * from designs where ds_id = ?';
  conn.query(sqlStr, dsid, (err, results) => {
    console.log(err);
    if (err) return res.json({ status: 1, message: '获取数据失败', affectedRows: 0 })
    let path = './public/' + results[0].ds_content
    fs.readFile(path, (err, data) => {
      console.log(err);
      if (err) return res.json({ status: 1, message: '文件不存在'});
      results[0].ds_content = marked(data.toString())
      res.json({ status: 0, message: results, affectedRows: 0 })
    })
    // results[0].ds_content = `http://${baseURL}:8085${results[0].ds_content}`
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
  const sqlStr = 'select c_content,c_time,u_name,u_himg from comments inner join users on comments.u_id=users.u_id where ds_id = ? order by c_time desc';
  conn.query(sqlStr, dsid, (err, results) => {
    if (err) return res.json({ status: 1, message: '获取评论失败', affectedRows: 0 })
    results.forEach(item => {
      if (item.u_himg) {
        item.u_himg = `http://${baseURL}:8085${item.u_himg}`;
      }
    })
    res.json({ status: 0, message: results, affectedRows: 0 })
  })
})

/**
 * 作品下发表评论
 */
router.post('/comment',(req, res) => {
  req.body.c_time = new Date();
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
