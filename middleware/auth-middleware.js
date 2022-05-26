const userDao = require("../modules/user-dao.js");

async function addUserToLocals(req, res, next) {
  const user = await userDao.retrieveUserWithAuthToken(req.cookies.authToken);
  res.locals.user = user;
  next();
}

function verifyAuthenticated(req, res, next) {

  //check if user exists
  if (res.locals.user) {
    next();
  } else {
    //check if token is in cookies
    //if yes get user from db and add it to local, if not ask user to login
    if (req.cookies.authToken) {
      const user = userDao.retrieveUserWithAuthToken(req.cookies.authToke);
      res.locals.user = user;
      next();
    } else {
      res.redirect("./login");

    }
  }
}

module.exports = {
  addUserToLocals,
  verifyAuthenticated,
};
