var pwnedPw = {}
pwnedPw.check = (function () {

  const isNode = () => typeof module !== "undefined" && module.exports

  if (isNode()) {
    const https = require('https')
    const crypto = require('crypto')

    function sha1 (data) {
      return new Promise(r =>
        r(crypto.createHash('sha1').update(data).digest('hex').toUpperCase())
      )
    }

    function getHashes (prefix) {
      return new Promise((resolve, reject) => {
        https.get('https://api.pwnedpasswords.com/range/' + prefix, res => {
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

  // else if browser
  } else {

    function sha1(message) {
        const msgBuffer = new TextEncoder('utf-8').encode(message)
        return crypto.subtle.digest('SHA-1', msgBuffer).then(hashBuffer => {
          const hashArray = Array.from(new Uint8Array(hashBuffer))
          const hashHex = hashArray.map(b => ('00' + b.toString(16)).slice(-2)).join('')
          return hashHex.toUpperCase()
        })
    }

    function getHashes(prefix) {
        return fetch('https://api.pwnedpasswords.com/range/' + prefix)
          .then(response => response.text())
    }
  }

  function check (password) {
    return new Promise((resolve, reject) => {
      if (typeof password !== 'string' && !(password instanceof String)) {
        return reject(new TypeError('password must be a String.'))
      }
      let suffix
      sha1(password.toString()).then(hash => { // in case of String object
        password = null

        let prefix = hash.slice(0, 5)
        suffix = hash.slice(5)
        hash = null

        return getHashes(prefix)
      }).then(data => {
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
          array = null
          suffix = null
          let count = matches[0] ? matches[0].count : 0
          matches = null
          return resolve(count)
        }).catch(err => {
          return reject(err)
        })
    })
  }

  if (isNode()) {
    module.exports = { check: check }
  } else {
    return check
  }
})()
