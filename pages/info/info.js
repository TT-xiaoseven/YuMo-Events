// pages/info/info.js

//hasSignedUp  true:已报名  false:未报名
//hasPaid  true:已付款  false:未付款
//participant.status  等待支付是0，已经支付是1，申请退款是2，已经退款是3

const app = getApp()
const infoUrl = require('../../config').infoUrl
const cancelUrl = require('../../config').cancelUrl
var util = require('../../utils/util.js'); 
var formatTime = require('../../utils/formatTime.js'); 

Page({

  /**
   * 页面的初始数据
   */
  data: {
    user: null,
    userInfo: null,
    isIpx: app.globalData.isIpx ? true : false,
    activity:{},
    participant:{},
    itemStyle:{
      color: '#444444',
      iconUrl: '../images/arrow-icon.png'
    },
    hasSignedUp: false,
    hasPaid: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.setData({
      activityId: options.id
    })
    app.getUserInfo(function (err, openid) {
      if (!err) {
        that.setData({
          user: wx.getStorageSync('user'),
          userInfo: wx.getStorageSync('userInfo')
        })
        that.getActivityInfo(options.id)
      } else {
        console.log('活动详情err:', err)
      }
    })
  },

  /**
   * 获取活动数据
   */
  getActivityInfo: function (activityId) {
    var that = this
    var l = infoUrl + '?token=' + that.data.user.token + '&activityId=' + activityId
    console.log(l)
    wx.request({
      url: l,
      data: {
      },
      method: 'GET',
      success: function (res) {
        console.log(res.data.result.activity)
        var activity = res.data.result.activity
        var activityTime = activity.activityTime
        var startTime = Number(formatTime.formatTimeAsNormal(activity.startTime))
        var endTime = Number(formatTime.formatTimeAsNormal(activity.endTime))
        var currentTime = Number(util.formatTime(new Date()))*10
        var aymd = activity.activityTime.split(' ')[0]
        var ahms = activity.activityTime.split(' ')[1]
        activity.activityTime = aymd + ' ' + ahms.split(':')[0] + ':' + ahms.split(':')[1]
        activity.shortTime = parseInt(activityTime.split(' ')[0].split('-')[1]) + '月' + parseInt(activityTime.split(' ')[0].split('-')[2]) + '日'
        activity.currentTime = currentTime
        activity.startTime = startTime
        activity.endTime = endTime
        that.setData({
          participant: res.data.result.participant,
          activity: activity,
          hasPaid: res.data.result.hasPaid,
          hasSignedUp: res.data.result.hasSignedUp
        })
      },
      complete: function (res) {
        console.log('活动详情请求结束:', res)
      }
    })
  },

  /**
   * 我要报名
   */
  bindSignBtnTap: function (event) {
    wx.navigateTo({
      url: '../sign/sign?id=' + event.currentTarget.dataset.id + '&imgUrl=' + event.currentTarget.dataset.url
    })
  },

  /**
   * 继续支付
   */
  bindPayBtnTap: function (event) {
    var that = this
    wx.navigateTo({
      url: '../pay/pay?id=' + that.data.participant.id + '&price=' + that.data.activity.activityFee
    })
  },

  /**
   * 取消报名
   */
  bindCancelBtnTap: function (event) {
    var that = this
    var l = cancelUrl + '?token=' + that.data.user.token + '&activityId=' + event.currentTarget.dataset.id
    console.log(l)
    wx.request({
      url: l,
      data: {
      },
      method: 'GET',
      success: function (res) {
        that.setData({
          participant: res.data.result,
        })
        console.log(res)
      },
      complete: function (res) {
        console.log('取消报名请求结束:', res)
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
    * item激活样式
    */
  onItemTouchStart: function () {
    var that = this
    var activeStyle = {
      color: '#d6bd77',
      iconUrl: '../images/arrow-icon_active.png'
    }
    that.setData({
      itemStyle: activeStyle
    })
  },

  /**
    * item默认样式
    */
  onItemTouchEnd: function () {
    var that = this
    var activeStyle = {
      color: '#444444',
      iconUrl: '../images/arrow-icon.png'
    }
    that.setData({
      itemStyle: activeStyle
    })

  },

  /**
     * 用户点击右上角分享
     */
  onShareAppMessage: function (event) {
    return {
      title: this.data.activity.name,
      desc: '',
      path: '/pages/info/info?id=' + this.data.activity.id
    }
  }
})