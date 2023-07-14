/* eslint flowtype-errors/show-errors: 0 */
import React from 'react';
import { Switch, Route } from 'react-router';
import NewPurchasePage from 'containers/Purchase/NewPurchasePage';
import SupplierListPage from "containers/Supplier/SupplierListPage";
import PurchaseListPage from 'containers/Purchase/PurchaseListPage';
import PurchaseItemsPage from 'containers/Purchase/PurchaseItemsPage';
import Outer from 'containers/Templates/Outer';
import SuccessPage from 'containers/SuccessPage';
import ProductListPage from 'containers/Product/ProductListPage';
import CategoryListPage from 'containers/Category/CategoryListPage';
import NewSalePage from 'containers/Sale/NewSalePage';
import SupplierDetailPage from 'containers/Supplier/SupplierDetailPage';
import SaleListPage from 'containers/Sale/SaleListPage';
import SaleItemListPage from 'containers/Sale/SaleItemListPage';
import CustomerListPage from 'containers/Customer/CustomerListPage';
import EmployeeListPage from 'containers/Employee/EmployeeListPage';
import DepartmentListPage from 'containers/Department/DepartmentListPage';
import PurchaseSettlementPage from 'containers/Purchase/PurchaseSettlementPage';

export default ({history}) => (
  <Outer history={history}>
    <Switch>
      <Route path="/sale/new" component={NewSalePage} />
      <Route path="/sale/list" component={SaleListPage} />
      <Route path="/sale/items" component={SaleItemListPage} />
      <Route path="/purchase/new" component={NewPurchasePage} />
      <Route path="/purchase/list" component={PurchaseListPage} />
      <Route path="/purchase/items" component={PurchaseItemsPage} />
      <Route path="/purchase/settlement" component={PurchaseSettlementPage} />
      <Route path='/category' component={CategoryListPage} />
      <Route path='/product' component={ProductListPage} />
      <Route path='/customer/list' component={CustomerListPage} />
      <Route path='/customer/detail' component={SupplierDetailPage} />
      <Route path='/supplier/list' component={SupplierListPage} />
      <Route path='/supplier/detail' component={SupplierDetailPage} />
      <Route path='/employee/list' component={EmployeeListPage} />
      <Route path='/department/list' component={DepartmentListPage} />
      <Route path='/success' component={SuccessPage} />
      {/* <Route path='/price' component={PricePage} />
          <Route path='/receiving' component={ReceivingPage} />
          <Route path='/payment' component={PaymentPage} />
          <Route path='/expense' component={ProductPage} />
          <Route path='/report' component={ReportPage} />
          <Route path='/report/dashboard' component={Home} /> */}
    </Switch>
  </Outer>
);

// TODO: loginde şifre yanlış ise refresh atıyor. hatalı user/pass mesajı
