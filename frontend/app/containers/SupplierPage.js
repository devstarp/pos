import React, { Component, useEffect } from 'react';
import { Table, Button, Icon, Modal, Form, Input, InputNumber, Popconfirm, PageHeader } from 'antd'
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { addSupplier, setSuppliers, deleteSupplier, } from '../redux/slices/supplier'
import moment from 'moment'
import CreateSupplierModal from '../components/Modal/CreateSupplierModal'
import {apiCreateSupplier, apiGetSuppliers} from '../api/supplier'
import { formatDate } from '../utils/dateTimeFun';
import {lang} from '../services/config'
import EditableRowTable from '../components/Table/EditableRowTable';

const columns = [{
  title: lang.name,
  dataIndex: 'name',
  editable:true,
  key: 'name',
}, {
  title: lang.phone,
  dataIndex: 'mobile_phone',
  editable:true,
  key: 'mobile_phone',
}, {
  title: lang.email,
  dataIndex: 'email',
  editable:true,
  key: 'email',
},
{
  title: lang.address,
  dataIndex: 'address',
  editable:true,
  key: 'address',
},{
  title: lang.registra,
  dataIndex: 'userName',
  editable:true,
  key: 'userName',
},
{
  title: lang.registerDate,
  dataIndex: 'created_at',
  key: 'created_at',
  render: (date) =>formatDate(date)
},
]

const SupplierPage =({supplier, dispatch})=>{
  const getSuppliers=async()=>{
    const resSuppliers = await apiGetSuppliers()
    if(resSuppliers&& !resSuppliers.error){
      dispatch(setSuppliers(resSuppliers.data))
    }
  }

  useEffect(()=>{
    getSuppliers()
  },[])
  return(
    <main>
      <PageHeader
        title={lang.categories}
        subTitle="This is a subtitle"
      >
        {/* <Form layout='inline' onFinish={handleSearch} initialValues={defaultFilter}>
      <Form.Item name='name' >
        <Input placeholder="Search name" />
      </Form.Item>
      <Form.Item  name='description'>
        <Input placeholder="Search description" />
      </Form.Item>
      <Form.Item name='created_at' >
        <DatePicker.RangePicker format='YYYY/MM/DD' />
      </Form.Item>
      <Form.Item name='new' valuePropName="checked" >
        <Checkbox>
          New
        </Checkbox>
      </Form.Item>
      <Form.Item name='available' valuePropName="checked" >
        <Checkbox>
          Availabele
        </Checkbox>
      </Form.Item>
      <Form.Item name='editable' valuePropName="checked" >
        <Checkbox>
          Editable
        </Checkbox>
      </Form.Item>
      <Button htmlType='submit'>Search</Button>
    </Form> */}
      </PageHeader>
      <div className='page-body'>
        <EditableRowTable
          dataSource={supplier.suppliers}
          // onAdd={()=>dispatch(addCategory())}
          // onSave={handleUpdate}
          // error={error}
          columns={columns}
        />
      </div>
    </main>
  )}

const mapStateToProps = (state) => ({
  supplier: typeof state.get('supplier').toJS === 'function' ? state.get('supplier').toJS() : state.get('supplier'),
});

export default connect (mapStateToProps)(SupplierPage)