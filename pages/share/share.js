// pages/share/share.js

const app = getApp()
const invitationUrl = require('../../config').invitationUrl

Page({

  /**
   * 页面的初始数据
   */
  data: {
    user: null,
    userInfo: null,
    participant: null,
    activity: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.setData({
      user: wx.getStorageSync('user'),
      userInfo: wx.getStorageSync('userInfo')
    })
    var l = invitationUrl + '?participantId=' + options.participantId + '&token=' + that.data.user.token
    console.log(l)
    wx.request({
      url: l,
      data: {
      },
      method: 'GET',
      success: function (res) {
        var activity = res.data.result.activity
        var startTime = activity.startTime.split(':')[0] + ':' + activity.startTime.split(':')[1]
        activity.startTime = startTime
        that.setData({
          participant: res.data.result,
          activity: activity
        })
      },
      complete: function (res) {
        console.log('邀请函请求结束:', res)
      }
    })
  },

  /**
  * 查看位置
  */
  bindLocationBtnTap: function (event) {
    var position = event.currentTarget.dataset.position
    var latitude = position.split(',')[0]
    var longitude = position.split(',')[1]
    wx.openLocation({
      latitude: Number(latitude),
      longitude: Number(longitude),
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '邀请函',
      desc: '',
      path: '/pages/share/share?participantId=' + this.data.participant.id
    }
  },

  /**
  * 返回活动主页
  */
  bindGoBackBtn: function (e) {
    var pages = getCurrentPages();  
    if (pages.length == 1) {  
      wx.redirectTo({  
        url: '../activity/activity'
      });  
    } else {  
      wx.navigateBack({
        delta: 100
      })  
    }    
  }
})