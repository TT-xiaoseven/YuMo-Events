// pages/mine/mine.js
//获取应用实例

//activityStatus  0:未开始  1:已结束
const app = getApp()
const mineUrl = require('../../config').mineUrl
var tabBar = require('../templates/templates.js');
var util = require('../../utils/util.js');  
var formatTime = require('../../utils/formatTime.js'); 

Page({

  /**
   * 页面的初始数据
   */
  data: {
    user: null,
    userInfo: null,
    participants: [],
    isIpx: app.globalData.isIpx ? true : false,
    isLogin: false
  },

  /**
   * 近期活动
   */
  bindEventsBtnTap: function (event) {
    var participant = event.currentTarget.dataset.participant
    if (participant.activity.chargeType == 0 || participant.hasPaid) {
      wx.navigateTo({
        url: '../share/share?participantId=' + participant.id
      })
    } else {
      wx.navigateTo({
        url: '../pay/pay?id=' + participant.id + '&price=' + participant.activity.activityFee
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function (options) {
    var that = this
    tabBar.tabbar("tabBar", that.data.isIpx, 1, that) //1表示第二个tabbar
    
    app.getUserInfo(function (err, openid) {
      if (!err) {
        that.setData({
          user: wx.getStorageSync('user'),
          userInfo: wx.getStorageSync('userInfo'),
          isLogin: true
        })
        var l = mineUrl + '?token=' + that.data.user.token
        console.log(l)
        wx.request({
          url: l,
          data: {
          },
          method: 'GET',
          success: function (res) {
            var participants = res.data.result
            for (var index in participants) {
              var currentTime = Number(util.formatTime(new Date()))*10
              var activityTime = Number(formatTime.formatTimeAsNormal(participants[index].activity.activityTime))
              var aymd = participants[index].activity.activityTime.split(' ')[0]
              var ahms = participants[index].activity.activityTime.split(' ')[1]
              participants[index].activity.activityTime = aymd.split('-')[1] + '-' + aymd.split('-')[2] + ' ' + ahms.split(':')[0] + ':' + ahms.split(':')[1]
              participants[index].activity.status = (currentTime < activityTime) ? 0 : 1
            }
            that.setData({
              participants: participants
            })
            console.log(participants)
          },
          complete: function (res) {
            console.log('我参加的活动请求结束:', res)
          }
        })
      } else {
        console.log('我参加的活动err:', err)
      }
    })
  }
})