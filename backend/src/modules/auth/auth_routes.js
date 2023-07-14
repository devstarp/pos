import { register, login, logout } from './auth_controller';
import validator from './auth_validator';
import AuthMiddleware from '../../middlewares/authentication';

const AuthRoutes = (app, prefix) => {
  app.route(`${prefix}/register`).post(validator('register'), register);
  app.route(`${prefix}/login`).post(validator('login'), login);
  app.route(`${prefix}/logout`).post(AuthMiddleware, logout);
};

export { AuthRoutes };
