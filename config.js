/**
 * 小程序配置文件
 */

// 此处主机域名是腾讯云解决方案分配的域名
// 小程序后台服务解决方案：https://www.qcloud.com/solution/la

var host = "www.yushancooking.com/yushan/api"
var config = {

  // 下面的地址配合云端 Server 工作
  host,

  // 用code换取openId
  openidUrl: `https://${host}/activity/openid`,

  // 获取近期活动列表的接口
  ongoingUrl: `https://${host}/activity/ongoing`,

  // 获取往期活动列表的接口
  endUrl: `https://${host}/activity/ended`,

  // 获取活动详情的接口
  infoUrl: `https://${host}/activity/info`,

  //活动报名
  signUrl: `https://${host}/activity/signup`,

  //取消报名
  cancelUrl: `https://${host}/activity/cancel`,

  //支付
  payUrl: `https://${host}/activity/pay/order`,

  //确认是否支付成功
  payCheckUrl: `https://${host}/activity/pay/check`,

  //查询邀请函的接口
  invitationUrl: `https://${host}/activity/invitation`,

  //查询我的预订
  mineUrl: `https://${host}/activity/mine`,
  
};

module.exports = config
