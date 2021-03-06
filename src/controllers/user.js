const { User } = require('../database/models');
const validation = require('../validations');
const { getStatusCode } = require('../utils/statusCode');

async function createUser(req, res, next) {
  try {
    const newUser = req.body;

    validation.verifyName(newUser.displayName);
    validation.verifyEmail(newUser.email);
    validation.verifyPassword(newUser.password);

    const token = validation.getToken(newUser.email);

    const [, created] = await User.findOrCreate({
      where: { email: newUser.email },
      defaults: {
        ...newUser,
      },
    });
    validation.isUserRegistered(created);

    res.status(getStatusCode('created')).json({ token });
  } catch (error) {
    next(error);
  }
}

async function getUsers(req, res, next) {
  try {
    const token = req.headers.authorization;

    validation.verifyToken(token);

    const users = await User.findAll();

    res.status(getStatusCode('ok')).json(users);
  } catch (error) {
    next(error);
  }
}

async function getUserById(req, res, next) {
  try {
    const token = req.headers.authorization;
    const { id } = req.params;

    validation.verifyToken(token);

    const user = await User.findOne({ where: { id } });
    validation.isConditionValid(user, 'notFound', 'User does not exist');

    res.status(getStatusCode('ok')).json(user);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createUser,
  getUsers,
  getUserById,
};
