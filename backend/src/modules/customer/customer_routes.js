import { update, create, get, getById, restore, remove, permanentRemove } from './customer_controller';
import validator from './customer_validator';
import AuthMiddleware from '../../middlewares/authentication';

const CustomerRoutes = (app, prefix) => {
  app.route(`${prefix}/customer/create`).post(AuthMiddleware, create);
  app.route(`${prefix}/customer/list`).get(AuthMiddleware, get);
  app.route(`${prefix}/customer/:id`).post(AuthMiddleware, create);
  app.route(`${prefix}/customer/:id`).get(AuthMiddleware, getById);
  app.route(`${prefix}/customer/:id`).patch(AuthMiddleware, validator('update'), update);
  app.route(`${prefix}/customer/:id/restore`).post(AuthMiddleware, restore);
  app.route(`${prefix}/customer/:id/db`).delete(AuthMiddleware,  permanentRemove);
  app.route(`${prefix}/customer/:id`).delete(AuthMiddleware, remove);
};

export { CustomerRoutes };
