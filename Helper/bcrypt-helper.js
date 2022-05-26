const bcrypt = require("bcrypt");

// Call function from create user / edit profile if password is changed.
// Pass plaintext password, return hashed password
async function hashPassword(plainTextPassword) {
  // generate salt for hashing - 10 appears to be default used in most cases
  const salt = await bcrypt.genSalt(10);
  // generate hashed password, with salt
  const hashedPassword = await bcrypt.hash(plainTextPassword, salt);

  return hashedPassword;
}

// Call function from login page
// Pass plaintext password from login form, pass hashed password from database - return true or false
async function comparePassword(plainTextPassword, hashedPassword) {
  const validPasswordCheck = await bcrypt.compare(
    plainTextPassword,
    hashedPassword
  );

  return validPasswordCheck;
}

// Export functions.
module.exports = {
  hashPassword,
  comparePassword,
};
