/* eslint flowtype-errors/show-errors: 0 */
import React from 'react';
import {Layout} from 'antd'
import Header from './Header';

export default ({children, history}) => (
  <Layout>
    <Header history={history} />
    <Layout.Content className='headerContent' >
      {children}
    </Layout.Content>
  </Layout>
);

// TODO: loginde şifre yanlış ise refresh atıyor. hatalı user/pass mesajı
