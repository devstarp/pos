import { create, get, getById, update, remove, restore, permanentRemove } from './department_controller';
import validator from './department_validator';
import AuthMiddleware from '../../middlewares/authentication';

const DepartmentRoutes = (app, prefix) => {
  app.route(`${prefix}/department/create`).post(AuthMiddleware, create);
  app.route(`${prefix}/department/list`).get(AuthMiddleware, get);
  app.route(`${prefix}/department/:id`).get(AuthMiddleware, getById);
  app.route(`${prefix}/department/:id`).patch(AuthMiddleware, validator('update'), update);
  app.route(`${prefix}/department/:id`).delete(AuthMiddleware, remove);
  app.route(`${prefix}/department/:id/restore`).post(AuthMiddleware, restore);
  app.route(`${prefix}/department/:id/db`).delete(AuthMiddleware, permanentRemove);
};

export { DepartmentRoutes };
