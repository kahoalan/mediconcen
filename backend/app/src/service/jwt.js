
const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET || 'default'

const generateToken = (userInfo) => {
  return jwt.sign(userInfo, jwtSecret, {
    expiresIn: '1h'
  });
}

const verifyToken = (token) => {
  if (!token) throw new Error('You need to Login')
  const decrypt = jwt.verify(token, jwtSecret);
  return {
    id: decrypt.id,
    email: decrypt.email,
    clinic_id: decrypt.clinic_id
  };
};

module.exports = { generateToken, verifyToken };
