const jwt = require("jsonwebtoken");

const generateToken = (user) => {
  return jwt.sign(
    {
      user_id: user.user_id,
      role_id: user.role_id,
      email: user.email,
      role: user.role?.role_name,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
};

module.exports = {
  generateToken,
};