import React, { Component } from 'react';
import { Button, Icon, Modal, Form, Input, InputNumber, Upload, Select } from "antd";
import {lang} from '../../services/config'

const currencies = [{
  value:'WON', name:'WON'
},{value:"USD", name:'USD'}]

const FormItem = Form.Item;

const CreateProductModal =({visible,title, onError, onSubmit, type, categories, onClose})=> {
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
          rules={[{ required: true, message: "Please input product's name!" }]}
        >
          <Input />
        </FormItem>
        <FormItem
          label={lang.barcode}
          name='barcode'
          style={{ display: 'flex' }}
        >
          <Input />
        </FormItem>
        <FormItem
          label={lang.productCode}
          name='product_code'
        >
          <Input />
        </FormItem>
        <FormItem
          label={lang.category}
          name='category_id'
        >
          <Select >
            {categories && categories.length>0 && categories.map(category=>
              <Select.Option value={category.id}>{category.name}</Select.Option>
            )}
          </Select>
        </FormItem>
        <FormItem
          label={lang.buyingPrice}
          name='purchase_price'
          rules={[{ required: true, message: "Please input product's price!" }]}
        >
          <Input />
        </FormItem>
        <FormItem
          label={lang.currencyType}
          name='purchase_currency'
        >
          <Select defaultValue='USD' >
            {currencies.map(currency=>
              <Select.Option value={currency.value}>{currency.name}</Select.Option>
            )}
          </Select>
        </FormItem>
      </Form>
    </Modal>
  );
        
        
}

export default CreateProductModal