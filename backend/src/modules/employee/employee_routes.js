import { create, get, getById, update, remove, restore, permanentRemove } from './employee_controller';
import validator from './employee_validator';
import AuthMiddleware from '../../middlewares/authentication';

const EmployeeRoutes = (app, prefix) => {
  app.route(`${prefix}/employee/create`).post(AuthMiddleware, create);
  app.route(`${prefix}/employee/list`).get(AuthMiddleware, get);
  app.route(`${prefix}/employee/:id`).get(AuthMiddleware, getById);
  app.route(`${prefix}/employee/:id`).patch(AuthMiddleware, validator('update'), update);
  app.route(`${prefix}/employee/:id`).delete(AuthMiddleware, remove);
  app.route(`${prefix}/employee/:id/restore`).post(AuthMiddleware, restore);
  app.route(`${prefix}/employee/:id/db`).delete(AuthMiddleware, permanentRemove);
};

export { EmployeeRoutes };
