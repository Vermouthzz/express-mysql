const Renames = (item, type = 'guige') => {
  const Enum = {
    guige: '规格',
    kuanshi: '款式',
    season: '季节',
    opcity: '容量',
    color: '颜色',
    favour: '口味',
    size: '尺码'
  }
  const Enums = {
    function: '功能',
    origin_place: '产地',
    suit_season: '适用季节',
    suit_age: '适用年龄',
    chicun: '尺寸',
    size: '尺码'
  }
  if (type == 'guige') {
    delete item['sp_id']
  }
  if (type == 'arg') {
    delete item['goods_id']
    delete item['argument_id']
  }
  type === 'arg' ? obj = Enums : obj = Enum
  for (let key in item) {
    for (let k in obj) {
      if (k == key) {
        //更换属性名
        let newName = obj[k]
        let oldName = key;
        Object.defineProperty(item, newName, Object.getOwnPropertyDescriptor(item, oldName))
        delete item[oldName]
      }
    }
  }
  if (type == 'list') {
    return item
  }
  let res = []
  for (let key in item) {
    let o = {
      name: key,
      value: item[key]
    }
    res.push(o)
  }
  return res
}

const ReCommon = (arr) => {
  let res = []
  arr.forEach(item => {
    delete item['sp_id']
  })
  let nameArr = Object.keys(arr[0])
  nameArr.forEach(item => {
    // 确定数据格式
    let a = {
      name: item,
      value: []
    }
    res.push(a)
  })
  res.forEach(item => {
    arr.forEach(i => {
      for (let k in i) {
        if (k === item.name) {
          item.value.push(i[k])
        }
      }
    })
    item.value = [...new Set(item.value)]
    let valArr = []
    item.value.forEach(i => {
      let obj = {
        name: i
      }
      valArr.push(obj)
    })
    item.value = valArr
  })
  return res
}

const reFee = (val) => {
  let eunm = {
    0: '不包邮',
    1: '单件包邮',
    2: '满99包邮'
  }
  for (key in eunm) {
    if (val == key) {
      return eunm[key]
    }
  }
}


exports.Renames = Renames
exports.ReCommon = ReCommon
exports.reFee = reFee
