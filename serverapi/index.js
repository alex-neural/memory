var exports = module.exports = {};

///// Main API ////
exports.api = (req, res) => {
  // get the path of URL request
  const path = req.originalUrl;
  // console.log('1.api path : ', path);
  switch (path) {
    case '/login':
      apiLogin(req, res);
      break
    default:
      apiErrorPage(req, res);
      break
  }
  return
}
//////////// API helpers ////////
const apiLogin = (req, res) => {
  res.status(200).send('LOGIN');
  return
}

const apiErrorPage = (req, res) => {
    res.status(404).send('page not found');
    return
}
