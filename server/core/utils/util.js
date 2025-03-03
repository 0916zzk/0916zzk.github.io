const NodeRSA = require('node-rsa');
const fs = require("fs")
const path = require("path")
const { privateKeyPath, publicKeyPath } = require('../../config');
const mongoPage = require("mongoose-sex-page")
const qs = require("qs")
//创建秘钥
function generateKeys() {
  //实例化 b 秘钥位 bit 越大越安全 256 , 512, 1024 - 4096
  const newkey = new NodeRSA({ b: 2048 });

  //设置秘钥模式
  newkey.setOptions({ encryptionScheme: 'pkcs1' })

  //设置公钥 
  let public_key = newkey.exportKey('pkcs8-public')//公钥,

  //设置私钥
  let private_key = newkey.exportKey('pkcs8-private') //私钥

  //写入公钥 私钥 cer文件
  fs.writeFileSync(path.join(process.cwd(), './auth/private.cer'), private_key);
  fs.writeFileSync(path.join(process.cwd(), './auth/public.cer'), public_key);

}
function encrypt(plain) {
  let public_key = fs.readFileSync(publicKeyPath, 'utf8');
  const nodersa = new NodeRSA(public_key);
  nodersa.setOptions({ encryptionScheme: 'pkcs1' });
  const encrypted = nodersa.encrypt(plain, 'base64');
  return encrypted;
}

function decrypt(cipher) {
  let private_key = fs.readFileSync(privateKeyPath, 'utf8'); //私钥
  let prikey = new NodeRSA(private_key);
  prikey.setOptions({ encryptionScheme: 'pkcs1' });
  return prikey.decrypt(cipher, 'utf8')
}
async function pagination({ model, query, options, populate, size, page, dis }) {
  if (typeof query === 'string') {
    query = qs.parse(query)
  }
  let result = await mongoPage(model).find(query).populate(populate).select(options).size(size).page(page).display(dis).exec()

  let { total, records: list, pages, display } = result
  //count 当次返回的 list的长度 数据数量
  let count = list.length
  return { count, page, size, total, list, pages, display }
}
function toDouble(num) {
  return String(num)[1] && String(num) || '0' + num;
}
function formatDate(date = new Date(), format = "yyyy-MM-dd hh:mm:ss") {

  let regMap = {
    'y': date.getFullYear(),
    'M': toDouble(date.getMonth() + 1),
    'd': toDouble(date.getDate()),
    'h': toDouble(date.getHours()),
    'm': toDouble(date.getMinutes()),
    's': toDouble(date.getSeconds()),
  }

  //逻辑(正则替换 对应位置替换对应值) 数据(日期验证字符 对应值) 分离
  return Object.entries(regMap).reduce((acc, [reg, value]) => {
    return acc.replace(new RegExp(`${reg}+`, 'g'), value);
  }, format);
}
module.exports = {
  encrypt, decrypt, pagination, formatDate
}
// generateKeys()