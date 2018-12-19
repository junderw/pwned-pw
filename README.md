# pwned-pw

## Installation

```
npm install pwned-pw
```

## Usage

```javascript
const pwnedPw = require('pwned-pw')

// returns a Promise
pwnedPw.check('123456').then(count => {
  console.log('Your pwned count is: ' + count)
  // Your pwned count is: 22390492
}).catch(error => {
  console.error('Your error is: ' + error.message)
})
```
