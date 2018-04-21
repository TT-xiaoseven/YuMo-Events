// pages/sign/sign.js

const app = getApp()
const signUrl = require('../../config').signUrl

Page({
  /**
   * 页面的初始数据
   */
  data: {
    user: null,
    userInfo: null,
    sexItems: [
      { name: '先生', value: '1', checked: 'true' },
      { name: '女士', value: '2' }
    ],
    dinnerItems: [
      { name: '是', value: '1', checked: 'true' },
      { name: '不了，谢谢', value: '0' }
    ],
    activityId: '',
    imgUrl: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    var user = wx.getStorageSync('user') || {};
    that.setData({
      user: user,
      userInfo: wx.getStorageSync('userInfo')
    })
    var items = that.data.sexItems;
    if (user.sex != undefined) {
      for (var i = 0, len = items.length; i < len; ++i) {
        items[i].checked = items[i].value == user.sex
      }
    }
    that.setData({
      sexItems: items,
      name: user.name,
      phone: user.phone,
      activityId: parseInt(options.id),
      imgUrl: options.imgUrl,
      city: user.city,
      trade: user.trade,
      address: user.address,
    })

    that.WxValidate = app.wxValidate({
      name: {
        required: true,
        minlength: 2,
        maxlength: 15
      },
      phone: {
        required: true,
        tel: true
      },
      city: {
        maxlength: 15
      },
      trade: {
        maxlength: 20
      },
      address: {
        maxlength: 100
      }
    }, {
        name: {
          required: '请输入姓名',
          minlength: '姓名太短',
          maxlength: '姓名太长',
        },
        phone: {
          required: '请输入手机号码',
        },
        city: {
          maxlength: '所在城市太长',
        },
        trade: {
          maxlength: '行业领域太长',
        },
        address: {
          maxlength: '联系地址太长',
        }
      })
    },

  /**
   * 事件处理函数
   */
  bindFormSubmit: function (e) {
    var that = this
    //表单验证
    if (!that.WxValidate.checkForm(e)) {
      const error = that.WxValidate.errorList[0]
      wx.showToast({
        title: `${error.msg} `,
        image: '/pages/images/error.png',
        duration: 2000
      })
      return false
    }
    var user = wx.getStorageSync('user') || {};
    user.name = e.detail.value.name
    user.phone = e.detail.value.phone
    user.sex = e.detail.value.sex
    user.city = e.detail.value.city
    user.trade = e.detail.value.trade
    user.address = e.detail.value.address
    wx.setStorageSync('user', user)

    wx.request({
      url: signUrl,
      data: {
        activityId: that.data.activityId,
        name: e.detail.value.name,
        phone: e.detail.value.phone,
        sex: e.detail.value.sex,
        useFood: e.detail.value.dinner,
        city: e.detail.value.city,
        trade: e.detail.value.trade,
        address: e.detail.value.address,
        token: that.data.user.token
      },
      method: 'POST',
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        console.log('报名success, response is:', res)
        var activity = res.data.result.activity
        console.log(activity)
        if (activity.chargeType != 0) {
          wx.navigateTo({
            url: '../pay/pay?id=' + res.data.result.id + '&price=' + activity.activityFee
          })
          return
        } 
        wx.navigateTo({
          url: '../share/share?participantId=' + res.data.result.id
        })
      }
    })
  },

  /**
  * 性别单选事件处理函数
  */
  sexRadioChange: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
    var items = this.data.sexItems;
    for (var i = 0, len = items.length; i < len; ++i) {
      items[i].checked = items[i].value == e.detail.value
    }
    this.setData({
      sexItems: items
    });
  },

  /**
  * 共进晚餐单选事件处理函数
  */
  dinnerRadioChange: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
    var items = this.data.dinnerItems;
    for (var i = 0, len = items.length; i < len; ++i) {
      items[i].checked = items[i].value == e.detail.value
    }
    this.setData({
      dinnerItems: items
    });
  }
})