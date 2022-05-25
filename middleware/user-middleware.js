const userDao = require("../modules/user-dao.js");

function verifyAuthenticated(req, res, next) {
  //check if user exists
  if (res.local.user) {
    next();
  } else {
      //check if token is in cookies
      //if yes get user from db and add it to local, if not ask user to login
    if (req.cookies.authToken) {
      const user = userDao.getUserByAuthToken(req.cookies.authToke);
      res.local.user = user;
    } else {
      res.redirect("./login");
    }
  }
}

module.exports = { verifyAuthenticated };
