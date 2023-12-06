const reServices = (id,type = 's') => {
  let Enum = {
    0: '新人特价',
    1: '限时优惠',
    2: '特价',
    3: '每日抄底',
    4: '百亿补贴',
    5: '囤货特价',
    6: '临期特惠',
    7: '品牌专供'
  }
  let Enum1 = {
    1: '单件包邮',
    2: '满99包邮'
  }
  if(type == 's') {
    obj = Enum
  } else {
    obj = Enum1
  }
  for(key in obj) {
    if(key == id) return obj[key]
  }
}

exports.reServices = reServices