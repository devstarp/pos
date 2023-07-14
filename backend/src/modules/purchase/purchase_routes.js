import { 
  get, getStatistics, create, createWithItems, update, getById, getFields,getItems,
  getByOrderNumber, remove, restore, permanentRemove, bulkUpdate 
} from './purchase_controller';
import validator from './purchase_validator';
import AuthMiddleware from '../../middlewares/authentication';

const PurchaseRoutes = (app, prefix) => {
  app.route(`${prefix}/purchase/list`).get(AuthMiddleware, get);
  app.route(`${prefix}/purchase/statistics`).get(AuthMiddleware, getStatistics);
  app.route(`${prefix}/purchase/fields`).get(AuthMiddleware, getFields);
  app.route(`${prefix}/purchase/create`).post(AuthMiddleware, create);
  app.route(`${prefix}/purchase/:id`).get(AuthMiddleware, getById);
  app.route(`${prefix}/purchase/:id/items`).get(AuthMiddleware, getItems);
  app.route(`${prefix}/purchase/order_number/:orderNumber`).get(AuthMiddleware, getByOrderNumber);
  app.route(`${prefix}/purchase/create_with_items`).post(AuthMiddleware, validator('createWithItems'), createWithItems);
  app.route(`${prefix}/purchase/:id`).patch(AuthMiddleware, validator('order'), update);
  app.route(`${prefix}/purchase/bulk/:ids`).patch(AuthMiddleware, validator('update'), bulkUpdate);
  app.route(`${prefix}/purchase/:id/restore`).post(AuthMiddleware, restore);
  app.route(`${prefix}/purchase/:id`).delete(AuthMiddleware, remove);
  app.route(`${prefix}/purchase/:id/db`).delete(AuthMiddleware, validator('order'), permanentRemove);
};

export { PurchaseRoutes };
