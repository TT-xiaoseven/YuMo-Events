const formatTimeAsNormal = date => {
  var value = ''
  var pattern = new RegExp("[-:. ]")
  for (var i = 0; i < date.length; i++) {
    value = value + date.substr(i, 1).replace(pattern, '');
  }
  return value
}

module.exports = {
  formatTimeAsNormal: formatTimeAsNormal
}