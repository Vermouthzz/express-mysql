const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1)); // 生成 0 到 i 之间的随机整数
    [array[i], array[j]] = [array[j], array[i]]; // 交换位置
  }
  return array;
}

exports.shuffleArray = shuffleArray