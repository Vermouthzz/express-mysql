const splitName = (arr) => {
  let res = [], result = []
  for (let i = 0; i < arr.length; i += 3) {
    arr.slice(i, i + 3).forEach(item => res.push(item.name))
  }
  for (let i = 0; i < res.length; i += 3) {
    result.push(res.slice(i, i + 3).join(' '))
  }
  return result
}

exports.splitName = splitName