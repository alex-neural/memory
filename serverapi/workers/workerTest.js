module.exports =  (inp, callback) => {
  callback(null, inp + ' BAR (' + process.pid + ')')
}
