import React from 'react';
import { connect } from 'react-redux';
import { Form, Input, Button, Card } from 'antd'
import { UserOutlined,LockOutlined, ShopOutlined, MailOutlined, EditOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types'
import { apiRegister } from 'api/auth';
import {lang} from 'services/config'
import { confirmRule, emailRule, requiredRule, rules } from 'utils/validationFunc';
import './users.css';

const Register=({ history})=>{
  const [form]= Form.useForm()
  
  const handleSubmit=async(values)=>{
    form.setFields([])
    const resAuth = await apiRegister(values);
    if(resAuth&& !resAuth.error){
      history.push('login')
    }else{
      resAuth.error && form.setFields(resAuth.error)
    }
  }
  
  const handleClickLogin =()=>{
    history.push('login')
  }
  return(
    <Card className='auth-card'>
      <ShopOutlined type="shopping-cart" className='logo-wrapper' />
      <Form 
        name="register-form"
        onFinish={handleSubmit}
        form={form}
        autoComplete="off"
      >
        <Form.Item name="id" rules={[requiredRule]} >
          <Input size='large'  prefix={<UserOutlined />} placeholder="id" />
        </Form.Item>
        <Form.Item name="email" rules={[emailRule]}>
          <Input size='large'  prefix={<MailOutlined />} placeholder="email" />
        </Form.Item>
        <Form.Item name="username" >
          <Input size='large'  prefix={<EditOutlined />} placeholder="username" />
        </Form.Item>
        <Form.Item name="first_name" rules={[requiredRule]}>
          <Input size='large'  prefix={<EditOutlined />} placeholder="First Name" />
        </Form.Item>
        <Form.Item name="last_name" rules={[requiredRule]}>
          <Input size='large'  prefix={<EditOutlined />} placeholder="Last Name" />
        </Form.Item>
        <Form.Item name="password" rules={[requiredRule]}>
          <Input
            size='large'
            prefix={<LockOutlined />}
            type='password'
            placeholder={lang.password}
          />
        </Form.Item>
        <Form.Item name="confirm_password" rules={[requiredRule, confirmRule('password')]}>
          <Input size='large' prefix={<LockOutlined />} type='password'placeholder={lang.confirmPassword} />
        </Form.Item>
        <Form.Item style={{ display: 'flex', justifyContent: 'center' }}>
          <Button  htmlType='submit'  type="primary" >{lang.registerButton}</Button>
        </Form.Item>
      </Form>
      <Button type="link" onClick={handleClickLogin}>{lang.alreadyRigsterButton}</Button>
    </Card>
  )}
  
Register.propTypes={
  history:PropTypes.object.isRequired,
}
export default connect()( Register);