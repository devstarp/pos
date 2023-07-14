// @flow
import React from 'react';
import { Button, Menu, Drawer,Avatar, Divider, Layout } from 'antd'
import PropTypes from 'prop-types';
import {lang} from 'services/config'
import { apiLogout } from 'api/auth';
import { clearAuthState } from 'redux/slices/auth';
import { connect } from 'react-redux';
import { Icons } from '../../assets/Icons'
import './templates.css'

const items=[
  {label:'Purchase', key:'/purchase',
    children:[
      {label:'New Purchase', key:'/purchase/new'},
      {label:'Purchase List', key:'/purchase/list'},
      {label:'Purchase Items', key:'/purchase/items'},
      {label:'Purchase Settlement', key:'/purchase/settlement'},
    ]
  },
  {label:'sale', key:'sale',
    children:[
      {label:'New Sale', key:'/sale/new'},
      {label:'Sale List', key:'/sale/list'}
    ]},
  {label:'product', key:'product',
    children:[
      {label:'product', key:'/product' },
      {label:'category', key:'/category'},
    ]},
  {label:'supplier', key:'supplier',
    children:[
      {label:'Suppliers', key:'/supplier/list'},
      {label:'Supplier Detail', key:'/supplier/detail'}
    ] },
  {label:'customer', key:'customer',
    children:[
      {label:'customers', key:'/customer/list'},
      {label:'customer Detail', key:'/customer/detail'}
    ] },
  {label:'employee', key:'employee',
    children:[
      {label:'employees', key:'/employee/list'},
      {label:'departments', key:'/department/list'},
    ] },  
  {label:'Logout', key:'logout' },
]
const Header =({history, dispatch})=>{
  const handleClickMenu=(event)=>{
    if(event.key==='logout'){
      handleSignOut()
    }else{
      console.log('history---', history)
      history.push(event.key)
    }
  }

  const handleSignOut=async()=>{
    const resAuth= await apiLogout();
    if(resAuth&&!resAuth.error){
      dispatch(clearAuthState())
    }
  }
  return(
    <Layout.Header >
      <Menu
        onClick={handleClickMenu}
        mode="horizontal"
        //   className='navbar-menu'
        items={items}
        // selectedKeys={selectedKeys}
      />
      <Drawer
        style={{textAlign:'center'}}
        title={lang.drawerTitle}
        placement="right"
        closable={false}
        //   onClose={this.onClose}
        //   visible={this.state.visible}
      >
        <Avatar size={116} icon="user" />
        <Divider />
        <Button >Logout</Button>
      </Drawer>
    </Layout.Header>
  )}

Header.propTypes = {
  history: PropTypes.func.isRequired,
  dispatch: PropTypes.func.isRequired,
};

export default connect()(Header)
