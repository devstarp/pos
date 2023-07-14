import { get, getDetail, create, update, restore, remove, permanentRemove } from './purchase_item_controller';
import validator from './purchase_item_validator';
import AuthMiddleware from '../../middlewares/authentication';

const PurchaseItemRoutes = (app, prefix) => {
  app.route(`${prefix}/purchase_item/list`).get(AuthMiddleware, get);
  // app.route(`${prefix}/purchase_item/fields`).get(AuthMiddleware, getFields);
  app.route(`${prefix}/purchase_item/create`).post(AuthMiddleware, create);
  // app.route(`${prefix}/purchase_item/:id`).get(AuthMiddleware, getById);
  app.route(`${prefix}/purchase_item/:id`).patch(AuthMiddleware, validator('order'), update);
  app.route(`${prefix}/purchase_item/:id/restore`).post(AuthMiddleware, restore);
  app.route(`${prefix}/purchase_item/:id`).delete(AuthMiddleware, remove);
  app.route(`${prefix}/purchase_item/:id/db`).delete(AuthMiddleware, permanentRemove);
};

export { PurchaseItemRoutes };
