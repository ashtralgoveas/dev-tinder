const validator = require("validator");

const validateSignUpData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;

  if (!firstName || !lastName) {
    throw new Error("First name and last name are required!");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Please provide a valid email address!");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Please provide a strong password!");
  }
};

module.exports = { validateSignUpData };
