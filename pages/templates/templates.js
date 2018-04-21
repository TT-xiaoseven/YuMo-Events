//初始化数据
function tabbarinit() {
  return [
    {
      "current": 0,
      "pagePath": "../activity/activity",
      "iconPath": "../images/events_icon.png",
      "selectedIconPath": "../images/events_icon_active.png"
    },
    {
      "current": 0,
      "pagePath": "../mine/mine",
      "iconPath": "../images/mine_icon.png",
      "selectedIconPath": "../images/mine_icon_active.png" 
    }
  ]

}
//tabbar 主入口
function tabbarmain(bindName = "tabdata", isIpx, index, target) {
  var that = target;
  var bindData = {};
  var otabbar = tabbarinit();
  otabbar[index]['iconPath'] = otabbar[index]['selectedIconPath']//换当前的icon
  otabbar[index]['current'] = 1;
  bindData[bindName] = otabbar;
  bindData['isIpx'] = isIpx;
  that.setData({ bindData });
}

module.exports = {
  tabbar: tabbarmain
}