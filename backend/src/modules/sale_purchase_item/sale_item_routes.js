import { get, getDetail, create, update, restore, remove, permanentRemove } from './sale_item_controller';
import validator from './sale_item_validator';
import AuthMiddleware from '../../middlewares/authentication';

const SaleItemRoutes = (app, prefix) => {
  app.route(`${prefix}/sale_item/list`).get(AuthMiddleware, get);
  // app.route(`${prefix}/sale_item/fields`).get(AuthMiddleware, getFields);
  app.route(`${prefix}/sale_item/create`).post(AuthMiddleware, create);
  // app.route(`${prefix}/sale_item/:id`).get(AuthMiddleware, getById);
  app.route(`${prefix}/sale_item/:id`).patch(AuthMiddleware, validator('order'), update);
  app.route(`${prefix}/sale_item/:id/restore`).post(AuthMiddleware, restore);
  app.route(`${prefix}/sale_item/:id`).delete(AuthMiddleware, remove);
  app.route(`${prefix}/sale_item/:id/db`).delete(AuthMiddleware, permanentRemove);
};

export { SaleItemRoutes };
