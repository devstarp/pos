import { get, create, update, remove, restore, permanentRemove } from './category_controller';
import validator from './category_validator';
import AuthMiddleware from '../../middlewares/authentication';

const CategoryRoutes = (app, prefix) => {
  app.route(`${prefix}/category/list`).get(AuthMiddleware, get);
  app.route(`${prefix}/category/create`).post(AuthMiddleware, validator('category'), create);
  app.route(`${prefix}/category/:id`).patch(AuthMiddleware, validator('category'), update);
  app.route(`${prefix}/category/:id`).delete(AuthMiddleware, remove);
  app.route(`${prefix}/category/:id/restore`).post(AuthMiddleware, restore);
  app.route(`${prefix}/category/:id/db`).delete(AuthMiddleware, permanentRemove);
};

export { CategoryRoutes };
