// pages/pay/pay.js
const app = getApp()
const payUrl = require('../../config').payUrl
const payCheckUrl = require('../../config').payCheckUrl

Page({

  /**
   * 页面的初始数据
   */
  data: {
    user: null,
    userInfo: null,
    loading: false,
    participantId: '',
    price: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    var user = wx.getStorageSync('user') || {};
    that.setData({
      user: user,
      userInfo: wx.getStorageSync('userInfo'),
      participantId: options.id,
      price: options.price
    })
  },

  /**
 * 支付事件处理函数
 */
  requestPayment: function () {
    var that = this
    that.setData({
      loading: true
    })
    if (that.data.user) {
      wx.request({
        url: payUrl,
        data: {
          participantId: that.data.participantId,
          token: that.data.user.token
        },
        method: 'GET',
        header: {
          "content-type": "application/x-www-form-urlencoded"
        },
        success: function (res) {
          console.log('order success, response is:', res)
          var payargs = res.data.result
          wx.requestPayment({
            'appId': payargs.appId,
            'timeStamp': payargs.timeStamp,
            'nonceStr': payargs.nonceStr,
            'package': payargs.packageInfo,
            'signType': payargs.signType,
            'paySign': payargs.paySign,
            'complete': function (res) {
              that.payCheck()
            }
          })
        }
      })
    } else {
      that.setData({
        loading: false
      })
    }
  },

  /**
   * 确认支付是否成功
   */
  payCheck: function () {
    var that = this
    wx.request({
      url: payCheckUrl,
      data: {
        participantId: that.data.participantId,
        token: that.data.user.token
      },
      method: 'GET',
      success: function (res) {
        console.log('确认支付请求成功:', res)
        that.setData({
          loading: false
        })
        var result = res.data.code
        if (result == '1') {
          wx.navigateTo({
            url: '../share/share?participantId=' + that.data.participantId
          })
        } else {
          wx.navigateTo({
            url: '../fail/fail'
          })
        }
      },
      complete: function (res) {
        console.log('确认支付请求结束:', res)
        that.setData({
          loading: false
        })
      }
    })
  },

  /**
  * 返回活动主页
  */
  bindGoBackBtn: function (e) {
    wx.navigateBack({
      delta: 100
    })    
  }

})