# pwned-pw

## Installation

```
npm install pwned-pw
```

## How can I trust the API server? (Hint: you don't need to)

Take two examples:
* `"123456"` (Most leaked password with over 22 million leaks)
* `"U4JeDx!AdY3;Jh8*J93#ZT8%3bSxM5y451aa"` (Not leaked yet... except now it's public so don't use.)


1. SHA1 hash each password once, and take the first 5 characters.
  * `"7C4A8D09CA3762AF61E59520943DC26494F8941B"`
  * `"7C4A8CF0102FC0FAC9193784678035EEC619262C"`
    * Both have the same first 5 characters, which makes sense since there is only around 1 million combinations of 5 characters of a 16 character set.
      * `"7C4A8"`
2. Query (GET) the API with the last section of the path as these 5 characters.
  * `"https://api.pwnedpasswords.com/range/7C4A8"`
  * Returns over 477 results.
    * Since their database has over 500 million hashes, the pidgeon hole principle states that given a set of 500 million and a possibility space of 1 million (the first five letters) each possibility from the space should have around 500 elements from the set that match it.
    * So no matter which 5 letters you send, the server will send back around 500 results.
  * Results are formatted as follows:
    * `D09CA3762AF61E59520943DC26494F8941B:22390492`
      * The 6th - 40th character (remainder) of the hash
      * A colon followed by the "number of times this password has appeared as plaintext or a simple unsalted hash in a database leak" (Every leak has thousands of people with 123456 as their password, which explains why there are nowhere near 22 million site leaks in the database but it gives us a count of over 22 million)
  * As you can see, `"123456"` is found over 22 million times.
  * If you check the results for the remainder of our "strong password" hash it is nowhere to be found...
3. Think from the API perspective. I did the same request twice. How can it know whether I found a match or not. Did the server learn anything about my "strong password" through this GET request. No it did not. It can not possibly learn anything.
4. This property is called k-anonymity. So use this package (and the underlying API) with confidence and help PROTECT YOUR USERS FROM THEMSELVES! :-D
5. This package will do all those steps above for you automatically, so just pass in the string, and await the results. If there's a match, tell your user not to use that password. (Some recommend to only reject a password if the count is >=10 etc. otherwise you're blocking one password that one user used on one site that got hacked... however, I believe that you should reject this since it proves the user is reusing passwords... which is a big no-no.)
  * However, I do think it might be fine to allow count === 1 passwords... under the condition you warn the user of the match.

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
