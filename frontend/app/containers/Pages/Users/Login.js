import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Form, Input, Button, Card, message } from 'antd'
import PropTypes from 'prop-types'
import { UserOutlined,LockOutlined, ShopOutlined } from '@ant-design/icons';
import { setAuth } from 'redux/slices/auth'
import {lang,pHost} from 'services/config'
import { apiLogin } from 'api/auth';
import { rules } from '../../../utils/validationFunc';
import './users.css';

const Login=({dispatch, history})=>{
  const [form]=Form.useForm()

  const handleSubmit=async(values)=>{
    const resAuth = await apiLogin(values);
    if(resAuth&& !resAuth.error){
      dispatch(setAuth(resAuth.data));
      resAuth.message&& message.success(resAuth.message)
    }else{
      resAuth.error && form .setFields(resAuth.error)
    }
  }
  const handleClickRegister =()=>{
    history.push('register')
  }
  return(
    <Card className='auth-card'>
      <ShopOutlined type="shopping-cart" className='logo-wrapper' />
      <Form 
        initialValues={{ remember: true }}
        onFinish={handleSubmit}
        form={form}
        autoComplete="off"
      >
        <Form.Item name="username" rules={rules.username}>
          <Input
            size='large'
            prefix={<UserOutlined />}
            placeholder={lang.username}
          />
        </Form.Item>
        <Form.Item name="password" rules={rules.password}>
          <Input
            size='large'
            prefix={<LockOutlined />}
            type='password'
            placeholder={lang.password}
          />
        </Form.Item>
        <Form.Item style={{ display: 'flex', justifyContent: 'center' }}>
          <Button  htmlType='submit'  type="primary" >{lang.loginButton}</Button>
        </Form.Item>
      </Form>
      <Button type="link" onClick={handleClickRegister}>{lang.noRegisterButton}</Button>
    </Card>
  )}
  
Login.propTypes={
  history:PropTypes.object.isRequired,
  dispatch:PropTypes.func.isRequired,
}
export default connect()( Login);