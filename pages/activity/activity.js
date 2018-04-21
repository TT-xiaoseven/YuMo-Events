//activity.js
//获取应用实例

//activityType  0:免费  1:收费  2:报名后退款
//chargeType  0:免费  1:个人  2:家庭  3:报名后退款
//activityTime  活动时间   startTime报名开始时间   endTime报名结束时间
const app = getApp()
const ongoingUrl = require('../../config').ongoingUrl
var tabBar = require('../templates/templates.js');

Page({
  data: {
    user: null,
    userInfo: null,
    activities: [],
    isIpx: app.globalData.isIpx ? true : false,
    isLogin: false,
    isCanShow: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    var that = this
    tabBar.tabbar("tabBar", that.data.isIpx, 0, that) //0表示第一个tabbar
    
    app.getUserInfo(function (err, openid) {
      if (!err) {
        that.setData({
          user: wx.getStorageSync('user'),
          userInfo: wx.getStorageSync('userInfo'),
          isLogin: true
        })
        var l = ongoingUrl + '?token=' + that.data.user.token
        console.log(l)
        wx.request({
          url: l,
          data: {
          },
          method: 'GET',
          success: function (res) {
            var activities = res.data.result
            for (var index in activities) {
              var activityTime = activities[index].activityTime
              activities[index].activityTime = activityTime.split('.')[0].split(':')[0] + ':' + activityTime.split('.')[0].split(':')[1]
            }
            that.setData({
              activities: activities,
              isCanShow: true
            })
            console.log(activities)
          },
          complete: function (res) {
            console.log('近期活动请求结束:', res)
          }
        })
      } else {
        console.log('近期活动err:', err)
      }
    })
  },

  /**
   * 往期精彩回顾
   */
  bindPastBtnTap: function() {
    wx.navigateTo({
      url: '../past/past'
    })
  },

  /**
   * 活动详情
   */
  bindItemBtnTap: function(event) {
    wx.navigateTo({
      url: '../info/info?id=' + event.currentTarget.dataset.id
    })
  },

  /**
     * 用户点击右上角分享
     */
  onShareAppMessage: function (event) {
    return {
      title: 'YU膳',
      desc: '',
      path: '/pages/activity/activity'
    }
  }
})
