define({ "api": [
  {
    "type": "get",
    "url": "/user/:id",
    "title": "获取id对应用户",
    "name": "GetUser",
    "group": "User",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>用户id。</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"status\": 0,\n  \"message\": [\n    {\n      \"u_id\": 1,\n      \"u_name\": \"测试01\",\n      \"u_pwd\": \"123456\",\n      \"u_phone\": \"123456\",\n      \"u_img\": null\n    }\n  ],\n  \"affectedRows\": 0\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/index.js",
    "groupTitle": "User"
  },
  {
    "type": "get",
    "url": "/users",
    "title": "获取全部用户",
    "name": "GetUsers",
    "group": "User",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Null",
            "optional": false,
            "field": "Null",
            "description": "<p>Null</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"status\": 0,\n  \"message\": [\n    {\n      \"u_id\": 1,\n      \"u_name\": \"测试01\",\n      \"u_pwd\": \"123456\",\n      \"u_phone\": \"123456\",\n      \"u_img\": null\n    },\n    {\n      \"u_id\": 2,\n      \"u_name\": \"测试02\",\n      \"u_pwd\": \"654321\",\n      \"u_phone\": \"123654\",\n      \"u_img\": null\n    }\n  ],\n  \"affectedRows\": 0\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/index.js",
    "groupTitle": "User"
  },
  {
    "type": "post",
    "url": "/user",
    "title": "创建用户",
    "name": "PostUser",
    "group": "User",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "u_name",
            "description": "<p>用户名称。</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "u_pwd",
            "description": "<p>用户密码。</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "u_phone",
            "description": "<p>用户手机号。</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "u_himg",
            "description": "<p>用户头像路径。</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"status\": 0,\n  \"message\": [\n    {\n      \"u_id\": 1,\n      \"u_name\": \"测试01\",\n      \"u_pwd\": \"123456\",\n      \"u_phone\": \"123456\",\n      \"u_img\": null\n    }\n  ],\n  \"affectedRows\": 0\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/index.js",
    "groupTitle": "User"
  }
] });
