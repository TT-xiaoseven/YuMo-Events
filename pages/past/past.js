// pages/past/past.js
const app = getApp()
const endUrl = require('../../config').endUrl

Page({

  /**
   * 页面的初始数据
   */
  data: {
    user: null,
    userInfo: null,
    activities: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    app.getUserInfo(function (err, openid) {
      if (!err) {
        that.setData({
          user: wx.getStorageSync('user'),
          userInfo: wx.getStorageSync('userInfo')
        })
        var l = endUrl + '?token=' + that.data.user.token
        console.log(l)
        wx.request({
          url: l,
          data: {
          },
          method: 'GET',
          success: function (res) {
            var activities = res.data.result
            for (var index in activities) {
              var startTime = activities[index].startTime
              activities[index].startTime = startTime.split('.')[0].split(':')[0].split(' ')[0]
            }
            that.setData({
              activities: activities
            })
            console.log(activities)
          },
          complete: function (res) {
            console.log('往期活动请求结束:', res)
          }
        })
      } else {
        console.log('往期活动err:', err)
      }
    })
  },

  /**
   * 查看往期活动详情
   */
  bindItemBtnTap: function (event) {
    wx.navigateTo({
      url: '../review/review?url=' + event.currentTarget.dataset.url
    })
  }
})