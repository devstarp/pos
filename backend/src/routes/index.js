import { prefix } from '../helpers/version_control';
import { AuthRoutes } from '../modules/auth/auth_routes';
import { EmployeeRoutes } from '../modules/employee/employee_routes';
import { CategoryRoutes } from '../modules/category/category_routes';
import { PurchaseRoutes } from '../modules/purchase/purchase_routes';
import { PurchaseItemRoutes } from '../modules/purchase_item/purchase_item_routes';
import { DepartmentRoutes } from '../modules/department/department_routes';
import { ProductRoutes } from '../modules/product/product_routes';
import { SupplierRoutes } from '../modules/supplier/supplier_routes';
import { CustomerRoutes } from '../modules/customer/customer_routes';
import { SaleRoutes } from '../modules/sale/sale_routes';
import { SaleItemRoutes } from '../modules/sale_item/sale_item_routes';
import { OrderRoutes } from '../modules/orders/order_routes';

const MainRoutes = (app) => {
  // Test the connection api
  app.route(`${prefix}/text`).get((req, res) => {
    res.send({
      message: 'Hello World',
    });
  });

  // authentication routes
  AuthRoutes(app, prefix);

  // department routes
  DepartmentRoutes(app, prefix);

  // employee routes
  EmployeeRoutes(app, prefix);

  // category routes
  CategoryRoutes(app, prefix);

  // purchase routes
  PurchaseRoutes(app, prefix);

  // purchase routes
  PurchaseItemRoutes(app, prefix);

  // product routes
  ProductRoutes(app, prefix);

  // supplier routes
  SupplierRoutes(app, prefix);

  // order routes
  OrderRoutes(app, prefix);
  // order routes

  CustomerRoutes(app, prefix);
  // order routes

  SaleRoutes(app, prefix);

  SaleItemRoutes(app, prefix);
};

export default MainRoutes;
