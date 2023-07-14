import React, { Component } from 'react';
import { Button, Icon, Modal, Form, Input, InputNumber, Upload, Select } from "antd";
import {lang} from '../../services/config'

const currencies = [{
  value:'WON', name:'WON'
},{value:"USD", name:'USD'}]

const FormItem = Form.Item;

const CreateSupplierModal =({visible,title, onError, onSubmit, type, categories, onClose})=> {
  const [form] = Form.useForm();

  const handleOk =async () => {
    try {
      const values = await form.validateFields();
      onSubmit && onSubmit(values);
      onClose()
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
       onError && onError(errInfo)
    }

    }
    
  const handleCancel = () => {
        form.resetFields();
        onClose()
  }

    return (
      <Modal
        title={title}
        visible={visible}
        onCancel={handleCancel}
        footer={[
          <Button onClick={handleCancel}>{lang.cancel}</Button>,
          <Button type="primary" htmlFor='submit' onClick={handleOk}>
            {lang.save}
          </Button>,
              ]}
      >
        <Form className='stock-form' form={form}>
          <FormItem
            label={lang.name}
            name='name'
            style={{ display: 'flex' }}
            // rules={[{ required: true, message: "Please input product's name!" }]}
          >
            <Input />
          </FormItem>
          <FormItem
            label={lang.mobilePhone}
            name='mobile_phone'
            style={{ display: 'flex' }}
            rules={[{ required: true, message: "Please input supplier's phone!" }]}
          >
            <Input />
          </FormItem>
          <FormItem
            label={lang.homePhone}
            name='home_phone'
          >
            <Input />
          </FormItem>
          <FormItem
            label={lang.officePhone}
            name='office_phone'
          >
            <Input />
          </FormItem>
          <FormItem
            label={lang.address}
            name='address'
          >
            <Input />
          </FormItem>
        </Form>
      </Modal>
    );
        
        
}

export default CreateSupplierModal