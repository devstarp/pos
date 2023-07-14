import React from 'react';
import { PropTypes } from 'prop-types';
import { Layout } from 'antd';
import './templates.css'

const { Content } = Layout;

const AuthOuter=({  children}) =>(
  <Content id="mainContent" className="noHeaderContent">
    {children}
  </Content>
)

AuthOuter.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthOuter;
