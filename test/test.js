const pwnedPw = require('..')
let firstCount

pwnedPw.check('123456').then(count1 => {
  if (typeof count1 !== 'number' || count1 < 1e6) {
    console.error('Error: weird value returned for normal string.')
    process.exit(1)
    return
  }
  console.log('Passed check #1 with count: ' + count1)
  firstCount = count1
  return pwnedPw.check(new String('123456'))
}).then(count2 => {
  if (typeof count2 !== 'number' || count2 < 1e6) {
    console.error('Error: weird value returned for String object.')
    process.exit(1)
    return
  }
  console.log('Passed check #2 with count: ' + count2)
  if (firstCount !== count2) {
    console.error('Error: counts for string and string object were different.')
    process.exit(1)
    return
  }
  console.log('Check #1 and #2 were equal!')
  return pwnedPw.check(123456).then(() => {
    console.error('Error: Does not throw Error on non-string')
    process.exit(1)
    return
  }, error => {
    if (error.message !== 'password must be a String.') {
      console.error('Error: Does not throw Error on non-string')
      process.exit(1)
      return
    }
    console.log('Passed check for throwing Error on non-string')
  }).then(() => {
    return pwnedPw.check('123456', 3).then(() => {
      console.error('Error: Does not throw Error on timeout')
      process.exit(1)
      return
    }, error => {
      if (error.message !== 'Timeout') {
        console.error('Error: Does not throw Error on timeout')
        process.exit(1)
        return
      }
      console.log('Passed check for throwing Error on timeout')
      console.log('\nALL CHECKS PASSED! :-D')
    })
  })
}).catch(error => {
  console.error('Error: unexpected error')
  console.error(error)
  process.exit(1)
  return
})
