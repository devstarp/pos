/* eslint flowtype-errors/show-errors: 0 */
import React from 'react';
import { Switch, Route } from 'react-router';
import {Layout} from 'antd'
// import {SalePage} from './containers/SalePage';
import {PurchasePage} from './containers/PurchasePage';
import {NavbarPage} from './containers/NavbarPage';
import {ProductPage} from './containers/ProductPage';
// import {StockPage} from './containers/StockPage';
import CustomerPage from './containers/CustomerPage';
import {SupplierPage} from "./containers/SupplierPage";
// import {PricePage} from "./containers/PricePage";
// import {ReceivingPage} from "./containers/ReceivingPage";
// import {PaymentPage} from "./containers/PaymentPage";
// import {ExpensePage} from "./containers/ExpensePage";
import CategoryPage from "./containers/CategoryPage";
// import { ReportPage } from "./containers/Report/ReportPage";
// import Home from "./components/Home";
import {App} from './containers/App';
import PurchasesPage from './containers/PurchasesPage';


const { Header, Footer, Sider, Content } = Layout;
export default () => (
  <App>
    <Switch>
      <Layout  style={{background:'white',height:"100vh"}}>
        <NavbarPage />
        <Content style={{background: 'white', margin:'10px'}}>
          {/* <Route path="/sale" component={SalePage} /> */}
          <Route path="/purchase/add" component={PurchasePage} />
          <Route path="/purchase" component={PurchasesPage} />
          <Route path='/category' component={CategoryPage} />
          <Route path='/product' component={ProductPage} />
          {/* <Route path='/stock' component={StockPage} /> */}
          <Route path='/client' component={CustomerPage} />
          <Route path='/dealer' component={SupplierPage} />
          {/* <Route path='/price' component={PricePage} />
          <Route path='/receiving' component={ReceivingPage} />
          <Route path='/payment' component={PaymentPage} />
          <Route path='/expense' component={ProductPage} />
          <Route path='/report' component={ReportPage} />
          <Route path='/report/dashboard' component={Home} /> */}
        </Content>
      </Layout>
    </Switch>
  </App>
);

// TODO: loginde şifre yanlış ise refresh atıyor. hatalı user/pass mesajı
