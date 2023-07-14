import React, { Component, Fragment, useEffect, useState } from 'react';
import { Descriptions, PageHeader, Select } from 'antd'
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { addcustomer, setcustomers, deletecustomer, updatecustomer, setcustomer, } from 'redux/slices/customer'
import {apiCreatecustomer, apiDeletecustomerById, apiGetcustomerById, apiGetcustomers, apiPermanentDeletecustomerById, apiRestorecustomerById, apiUpdatecustomerById} from 'api/customer'
import { formatDate } from 'utils/dateTimeFun';
import {lang} from 'services/config'
import EditableRowTable from 'components/Table/EditableRowTable';
import { requiredRule, numberRule } from 'utils/validationFunc';
import BooleanIcon from 'components/Icon/BooleanIcon';
import { getFullName, makeJSVariableName } from 'utils/dataFunc';
import { CURRENCIES, DEFAULT_PAGINATION, customer_FIELD_NAMES } from 'config/contstants';
import { getFilterQuery, getPaginationQuery, getSortQuery } from 'utils/appFunc';
import { apiGetPurchases } from 'api/purchase';
import { get } from 'lodash';

const CustomerDetailPage =({customer, dispatch, auth, history})=>{
  const defaultcustomer = get(history, 'location.state.customer') || {}
  const defaultColumns = [
    {
      key: 'order_number',
      ellipsis: true,
      customFilter:true,
      multiSorter:true,
    },
    {
      key: 'customer_id',
      title: lang.customer,
      dataIndex: ['customer', 'name'],
      editable:true, 
      inputType:'select',
      filterType:'checkGroup',
      customFilter:true,
      multiSorter:true,
      options:customer.customers,
      rules:[requiredRule]
    },
    {
      title: lang.author,
      dataIndex: 'user',
      key: 'user_id',
      render: (user) =>getFullName(user),
      ellipsis: true,
      rules:[requiredRule]
    },
    {
      key: 'comment',
      editable:true,
      customFilter:true,
      multiSorter:true,
    },
    {
      key: 'total_amount',
      editable:true,
      inputType:'number',
      filterType:'numberRange',
      customFilter:true,
      multiSorter:true,
      rules:[requiredRule, numberRule]
    },
    {
      key: 'subtotal_amount',
      editable:true,
      inputType:'number',
      filterType:'numberRange',
      customFilter:true,
      multiSorter:true,
      rules:[requiredRule, numberRule]
    },
    {
      key: 'currency',
      title: lang.currencyType,
      editable:true,
      inputType:'select',
      filterType:'checkGroup',
      customFilter:true,
      multiSorter:true,
      options:CURRENCIES,
      rules:[requiredRule],
    },
    {
      key: 'new',
      type:'status',
      editable:true,
      customFilter:true,
      inputType:'check',
      filterType:'booleanCheckGroup',
      align:'center',
      ellipsis: true,
      width: 100,
      render: value=> <BooleanIcon value={value} />
    },
    {
      key: 'editable',
      type:'status',
      customFilter:true,
      editable:true,
      inputType:'check',
      filterType:'booleanCheckGroup',
      align:'center',
      width: 100,
      ellipsis: true,
      render: value=> <BooleanIcon value={value} />
    },
    {
      key: 'enabled',
      type:'status',
      customFilter:true,
      filterType:'booleanCheckGroup',
      align:'center',
      width: 100,
      ellipsis: true,
      render: value=> <BooleanIcon value={value} />
    },
    {
      key: 'created_at',
      type:'date',
      inputType: 'date',
      customFilter:true,
      filterType: 'dateRange',
      multiSorter:true,
      render: (date) => formatDate(date)
    },
    {
      key: 'updated_at',
      type:'date',
      customFilter:true,
      filterType: 'dateRange',
      multiSorter:true,
      render: (date) => formatDate(date)
    },
    {
      key: 'deleted_at',
      type:'date',
      customFilter:true,
      filterType: 'dateRange',
      multiSorter:true,
      render: (date) => formatDate(date)
    },
  ]

  const [error, setError]=useState();
  const [columns, setColumns]=useState(defaultColumns)
  const [selectedFields, setSelectedFields]=useState(customer_FIELD_NAMES)
  const [pagination, setPagination]=useState(DEFAULT_PAGINATION);
  const [filters, setFilters]=useState()
  const [sorters, setSorters]=useState();
  const [purchases, setPurchases]=useState([])

  const getcustomer=async()=>{
    const rescustomer = await apiGetcustomerById(defaultcustomer.id,{includes: 'purchase,purchase_item'})
    if(rescustomer&& !rescustomer.error){
      dispatch(setcustomer(rescustomer.data))
      setPurchases(rescustomer.data.purchases)
    }
  }

  const getPurchases = async()=>{
    // const resPurchases = await apiGetPurchases(getQuery(values))
    // if(resPurchases && !resPurchases.error){
    //   dispatch(setPurchases(resPurchases.data))
    // }
  }

  const handleSelectFields=(_fields)=>{
    setSelectedFields(_fields)
  }

  const handleChangeTable=(_pagination, _filters, _sorters)=>{
    setPagination(getPaginationQuery(_pagination))
    setSorters(getSortQuery(_sorters))
    setFilters(getFilterQuery(_filters))
  }

  const handleSave=async(draft, _customer)=>{
    let rescustomer;
    if(!_customer.id){
      rescustomer= await apiCreatecustomer(draft)
    }else{
      rescustomer = await apiUpdatecustomerById(_customer.id, draft)
    }
    if(rescustomer&&!rescustomer.error){
      if(_customer.id){
        dispatch(updatecustomer(rescustomer.data))
      }else{
        dispatch(addcustomer(rescustomer.data))
        dispatch(deletecustomer(0))
      }
    }else{
      rescustomer.error&& setError(rescustomer.error)
    }
    
  }

  const handleDelete =async(id)=>{
    if(id===0){
      dispatch(deletecustomer(id))
    }else{
      const rescustomer = await apiDeletecustomerById(id)
      if(rescustomer&&!rescustomer.error){
        dispatch(updatecustomer(rescustomer.data))
      }
    }
  }

  const handleRestore =async(id)=>{
    const rescustomer = await apiRestorecustomerById(id)
    if(rescustomer&&!rescustomer.error){
      dispatch(updatecustomer(rescustomer.data))
    }
  }

  const handlePermanentDelete =async(id)=>{
    const resProduct = await apiPermanentDeletecustomerById(id)
    if(resProduct&&!resProduct.error){
      dispatch(deletecustomer(resProduct.data))
    }
  }

  const handleDetail=(_customer)=>{
    history.push({pathname:'/customer/detail', state:{customer:_customer}})
  }

  useEffect(()=>{
    getcustomer()
  },[])

  useEffect(()=>{
    customer.customer.id && getPurchases()
  },[customer.customer.id, pagination.page_size, pagination.current, filters, sorters])

  useEffect(()=>{
    setColumns(defaultColumns.filter(column=>selectedFields.includes(column.key)))
  },[selectedFields])

  const fieldSelects= customer_FIELD_NAMES.map(fieldName=>({id:fieldName, title: lang[makeJSVariableName(fieldName)]}))

  return(
    <Fragment>
      <PageHeader
        title={lang.customers}
        subTitle={customer.customer.name}
        // extra={[
        //   <Select mode='tags' maxTagCount={4} value={selectedFields} style={{minWidth:100}} onChange={handleSelectFields} >
        //     {fieldSelects.map(field=>(
        //       <Select.Option  key={field.id} value={field.id}>{field.title}</Select.Option>
        //     ))}
        //   </Select>
        // ]}
      >
        <Descriptions size="small" column={3}>
          <Descriptions.Item label="ID">{customer.customer.id}</Descriptions.Item>
          <Descriptions.Item label="Name">{customer.customer.name}</Descriptions.Item>
          <Descriptions.Item label="Mobile Phone">{customer.customer.mobile_phone}</Descriptions.Item>
          <Descriptions.Item label="Home Phone">{customer.customer.home_phone}</Descriptions.Item>
          <Descriptions.Item label="Office Phone">{customer.customer.office_phone}</Descriptions.Item>
          <Descriptions.Item label="Other Phone">{customer.customer.other_phone}</Descriptions.Item>
          <Descriptions.Item label="New">
            <BooleanIcon value={customer.customer.new} />
          </Descriptions.Item>
          <Descriptions.Item label="Editable">
            <BooleanIcon value={customer.customer.editable} />
          </Descriptions.Item>
          <Descriptions.Item label="Enabled">
            <BooleanIcon value={customer.customer.enabled} />
          </Descriptions.Item>
          <Descriptions.Item label="Created Date">{formatDate(customer.customer.created_at)}</Descriptions.Item>
          <Descriptions.Item label="Created Date">{formatDate(customer.customer.updated_at)}</Descriptions.Item>
          <Descriptions.Item label="Created Date">{formatDate(customer.customer.deleted_at)}</Descriptions.Item>
        </Descriptions>
      </PageHeader>
      <EditableRowTable
        dataSource={purchases}
        columns={columns}
        pagination={{
          showSizeChanger: true, 
          pageSizeOptions: ["6","8","10","15","20"], 
          total:pagination.total,
          pageSize: pagination.page_size
        }}
      />
    </Fragment>
  )}

CustomerDetailPage.propTypes = {
  customer: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
};
  
const mapStateToProps = (state) => ({
  customer: typeof state.get('customer').toJS === 'function' ? state.get('customer').toJS() : state.get('customer'),
  auth: typeof state.get('auth').toJS === 'function' ? state.get('auth').toJS() : state.get('auth'),
});

export default connect (mapStateToProps)(CustomerDetailPage)