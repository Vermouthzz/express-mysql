const redis = require('redis')

const redisConfig = {
  host: '127.0.0.1',
  port: 6379,
  // detect_buffers: true, // 传入buffer 返回也是buffer 否则会转换成String
  // // retry_strategy: function (options) {
  // //   // 重连机制
  // //   if (options.error && options.error.code === "ECONNREFUSED") {
  // //     // End reconnecting on a specific error and flush all commands with
  // //     // a individual error
  // //     return new Error("The server refused the connection");
  // //   }
  // //   if (options.total_retry_time > 1000 * 60 * 60) {
  // //     // End reconnecting after a specific timeout and flush all commands
  // //     // with a individual error
  // //     return new Error("Retry time exhausted");
  // //   }
  // //   if (options.attempt > 10) {
  // //     // End reconnecting with built in error
  // //     return undefined;
  // //   }
  // //   // reconnect after
  // //   return Math.min(options.attempt * 100, 3000);
  // // }
};

// 创建Redis客户端
const client = redis.createClient(redisConfig);


client.syncGet = async (key) => {
  const newGet = async (key) => {
    let val = await new Promise((resolve, reject) => {
      client.get(key, function (err, res) {
        return resolve(res)
      })
    })
    return JSON.parse(val)
  }
  return await newGet(key)
}

client.on('connect', () => console.log('Connected to Redis'));






module.exports = client