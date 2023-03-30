const { checkToken } = require('../../utils/token');

describe('checkToken', () => {
  it('calls next middleware on successful token validation', () => {
    const req = {
      headers: {
        authorization: 'Bearer valid_token',
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const next = jest.fn();

    checkToken(req, res, next);

    // Verify that the next middleware is called
    expect(next).toHaveBeenCalled();
  });

  it('returns a 401 error if no token is provided', () => {
    const req = {
      headers: {},
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const next = jest.fn();

    checkToken(req, res, next);

    // Verify that the response status is set to 401
    expect(res.status).toHaveBeenCalledWith(401);

    // Verify that the error message is sent in the response
    expect(res.json).toHaveBeenCalledWith({ error: 'No token provided' });

    // Verify that the next middleware is not called
    expect(next).not.toHaveBeenCalled();
  });

  // ... (other test cases)
});
