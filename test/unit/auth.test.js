const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const auth = require('../../utils/auth');

const secretKey = process.env.JWT_SECRET;

describe('Authentication', () => {
  it('should hash a password correctly', async () => {
    const password = 'mypassword';
    const hash = await auth.hashPassword(password);
    expect(await bcrypt.compare(password, hash)).toBe(true);
  });

  it('should create a valid JWT token', () => {
    const userId = 1;
    const token = auth.createToken(userId);
    expect(token).toBeTruthy();
    const decoded = jwt.verify(token, secretKey);
    expect(decoded.id).toBe(userId);
  });
});
