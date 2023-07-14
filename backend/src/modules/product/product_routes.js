import { get, getByBarcode, getById, create, update, remove, permanentRemove, restore, bulkUpdate} from './product_controller';
import validator from './product_validator';
import AuthMiddleware from '../../middlewares/authentication';
// import { upload } from './product_repository';

const ProductRoutes = (app, prefix) => {
  app.route(`${prefix}/product/create`).post(AuthMiddleware, create);
  app.route(`${prefix}/product/list`).get(AuthMiddleware, get);
  app.route(`${prefix}/product/:id`).get(AuthMiddleware, getById);
  app.route(`${prefix}/product/barcode/:barcode`).get(AuthMiddleware, getByBarcode);
  app.route(`${prefix}/product/:id`).patch(AuthMiddleware, validator('update'), update);
  app.route(`${prefix}/product/bulk/:ids`).patch(AuthMiddleware, validator('update'), bulkUpdate);
  app.route(`${prefix}/product/:id`).delete(AuthMiddleware, remove);
  app.route(`${prefix}/product/:id/restore`).post(AuthMiddleware, restore);
  app.route(`${prefix}/product/:id/db`).delete(AuthMiddleware, permanentRemove);
};

export { ProductRoutes };
