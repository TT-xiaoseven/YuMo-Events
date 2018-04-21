//app.js
import wxValidate from 'utils/wxValidate'
const openidUrl = require('./config').openidUrl

App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 获取手机信息
    wx.getSystemInfo({
      success: res => {
        let model = res.model.substring(0, res.model.indexOf("X")) + "X";
        console.log("momde==="+model)
        if (model == 'iPhone X' || model == 'iphoneX') {
          this.globalData.isIpx = true  //判断是否为iPhone X 默认为值false，iPhone X 值为true
        }
      }
    })
  },

  globalData: {
    userInfo: null,
    isIpx: false
  },

  /**
  * 获取用户信息
  */
  getUserInfo: function (callback) {
    var that = this
    var user = wx.getStorageSync('user') || {};
    var userInfo = wx.getStorageSync('userInfo') || {};
    if ((!user.openid || (user.expires_in || Date.now()) < (Date.now() + 600)) && (!userInfo.nickName)) {
      wx.login({
        success: function (loginRes) {
          console.log('用户登录成功code=' + loginRes.code)
          var l = openidUrl + '?code=' + loginRes.code
          console.log('授权请求：' + l)
          wx.getUserInfo({
            success: function (firstRes) {
              console.log('获取用户信息成功' + firstRes.userInfo)
              wx.setStorageSync('userInfo', firstRes.userInfo)//存储userInfo  
              
              wx.request({
                url: l,
                data: {},
                method: 'GET',
                success: function (openRes) {
                  console.log(openRes.data)
                  var obj = {}
                  obj.openid = openRes.data.result.openid
                  obj.expires_in = Date.now() + openRes.data.result.expires_in
                  obj.token = openRes.data.result.token
                  obj.vipCode = openRes.data.result.vipCode
                  wx.setStorageSync('user', obj)//存储openid
                  console.log(obj.openid)
                  callback(null, obj.openid)
                },
                complete: function (openRes) {
                  console.log('获取用户信息请求结束:', openRes)
                }
              });
            },
            fail: function (err) { //用户点了“拒绝”,向用户提示需要权限才能继续
              wx.showModal({
                title: '提示',
                content: '必须授权登录之后才能操作，是否要重新授权登录？',
                cancelText: '暂不授权',
                confirmText: '立即授权',
                success: function (modal) {
                  if (modal.confirm) {
                    console.log('用户点击确定')
                    wx.openSetting({
                      success: function (openRes) {
                        console.log('再次授权' + openRes.authSetting["scope.userInfo"])
                        if (openRes.authSetting["scope.userInfo"]) {
                          //这里是授权成功之后 填写你重新获取数据的js
                          wx.getUserInfo({
                            success: function (secondRes) {
                              console.info("2成功获取用户返回数据");
                              wx.setStorageSync('userInfo', secondRes.userInfo)
                              wx.request({
                                url: l,
                                data: {},
                                method: 'GET',
                                success: function (openRes) {
                                  var obj = {}
                                  obj.openid = openRes.data.result.openid
                                  obj.expires_in = Date.now() + openRes.data.result.expires_in
                                  obj.token = openRes.data.result.token
                                  obj.vipCode = openRes.data.result.vipCode
                                  wx.setStorageSync('user', obj)//存储openid
                                  console.log(openRes + obj.openid)
                                  callback(null, obj.openid)
                                }
                              });
                            },
                            fail: function (err) {
                              console.info("2授权失败返回数据");
                              callback(err)
                            }
                          });
                          console.log('再次授权成功')
                        }
                      },
                      fail: function (err) { //调用失败，授权登录不成功
                        console.log('调用失败，授权登录不成功')
                        callback(err)
                      }
                    })
                  } else if (modal.cancel) {
                    console.log('用户点击取消')
                    callback(modal)
                  }
                }
              })
            }
          });
        },
        fail: function (err) {
          console.log('获取用户登录态失败！' + loginRes.errMsg)
          callback(err)
        }
      });
    } else {
      callback(null, user.openid)
    }
  },

  wxValidate: (rules, messages) => new wxValidate(rules, messages)
})