const userDao = require("../modules/user-dao.js");

async function addUserToLocals(req, res, next) {
  const user = await userDao.retrieveUserWithAuthToken(req.cookies.authToken);
  res.locals.user = user;
  next();
}

async function verifyAuthenticated(req, res, next) {


  //check if user exists
  if (res.locals.user) {
    

    
    next();
  } else {
    //check if token is in cookies
    //if yes get user from db and add it to local, if not ask user to login
    if (req.cookies.authToken) {
      const user = await userDao.retrieveUserWithAuthToken(req.cookies.authToken);
      
      if(user == undefined){
        

        res.clearCookie("authToken");
        res.locals.user = null;
        res.redirect("./noUser");
        
      } else  {
       

        res.locals.user = user;
        next();
      }

    } else {
      
      // A user is able to see the home page if they are not logged in
      // this redirects to home, rather than login
      res.locals.user = null;
      res.redirect("./noUser");

    }
  }
}

module.exports = {
  addUserToLocals,
  verifyAuthenticated,
};
