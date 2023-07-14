import { get, getById, create, update, bulkUpdate,remove, restore, permanentRemove, getByOrderNumber, createWithItems } from './sale_controller';
import validator from './sale_validator';
import AuthMiddleware from '../../middlewares/authentication';

const SaleRoutes = (app, prefix) => {
  app.route(`${prefix}/sale/list`).get(AuthMiddleware, get);
  app.route(`${prefix}/sale/create`).post(AuthMiddleware, create);
  app.route(`${prefix}/sale/:id`).get(AuthMiddleware, getById);
  app.route(`${prefix}/sale/order_number/:orderNumber`).get(AuthMiddleware, getByOrderNumber);
  app.route(`${prefix}/sale/create_with_items`).post(AuthMiddleware, validator('createWithItems'), createWithItems);
  app.route(`${prefix}/sale/bulk/:ids`).patch(AuthMiddleware, validator('update'), bulkUpdate);
  app.route(`${prefix}/sale/:id`).patch(AuthMiddleware, validator('order'), update);
  app.route(`${prefix}/sale/:id/restore`).post(AuthMiddleware, restore);
  app.route(`${prefix}/sale/:id`).delete(AuthMiddleware, remove);
  app.route(`${prefix}/sale/:id/db`).delete(AuthMiddleware, permanentRemove);

};

export { SaleRoutes };
