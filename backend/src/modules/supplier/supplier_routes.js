import { update, create, get, restore, remove, permanentRemove, getById } from './supplier_controller';
import validator from './supplier_validator';
import AuthMiddleware from '../../middlewares/authentication';

const SupplierRoutes = (app, prefix) => {
  app.route(`${prefix}/supplier/create`).post(AuthMiddleware, create);
  app.route(`${prefix}/supplier/list`).get(AuthMiddleware, get);
  app.route(`${prefix}/supplier/:id`).post(AuthMiddleware, create);
  app.route(`${prefix}/supplier/:id`).get(AuthMiddleware, getById);
  app.route(`${prefix}/supplier/:id`).patch(AuthMiddleware, validator('update'), update);
  app.route(`${prefix}/supplier/:id/restore`).post(AuthMiddleware, restore);
  app.route(`${prefix}/supplier/:id/db`).delete(AuthMiddleware,  permanentRemove);
  app.route(`${prefix}/supplier/:id`).delete(AuthMiddleware, remove);
};

export { SupplierRoutes };
