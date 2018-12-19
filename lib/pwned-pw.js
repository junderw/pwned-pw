const https = require('https')
const crypto = require('crypto')
const URL_PREFIX = 'https://api.pwnedpasswords.com/range/'

function sha1 (data) {
  return crypto.createHash('sha1').update(data).digest('hex').toUpperCase()
}

function getHashes (prefix) {
  return new Promise((resolve, reject) => {
    https.get(URL_PREFIX + prefix, res => {
      let data = ''
      let result
      res.setEncoding('utf8')
      res.on('data', chunk => {
          data += chunk
      })
      res.on('end', () => {
          resolve(data)
      })
    }).on('error', err => {
      reject(err)
    })
  })
}

function check (password) {
  return new Promise((resolve, reject) => {
    if (typeof password !== 'string' && !(password instanceof String)) {
      return reject(new TypeError('password must be a String.'))
    }
    let hash = sha1(password.toString()) // in case of String object
    password = null

    let prefix = hash.slice(0, 5)
    let suffix = hash.slice(5)
    hash = null

    return getHashes(prefix).then(data => {
      prefix = null
      let array = data.trim().split('\n')
      data = null
      array = array.map(item => {
          let parts = item.split(':')
          return {
              suffix: parts[0].toUpperCase(),
              count: parseInt(parts[1])
          }
      })
      let matches = array.filter(item => item.suffix === suffix)
      let count = matches[0] ? matches[0].count : 0
      array = null
      matches = null
      suffix = null
      return resolve(count)
    }).catch(err => {
      return reject(err)
    })
  })
}

module.exports = { check }
