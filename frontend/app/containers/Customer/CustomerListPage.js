import React, { Fragment, useEffect, useState } from 'react';
import { PageHeader, Select } from 'antd'
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { addcustomer, setcustomers, deletecustomer, updatecustomer, } from 'redux/slices/customer'
import {apiCreateCustomer, apiDeleteCustomerById, apiGetCustomers, apiPermanentDeleteCustomerById, apiRestoreCustomerById, apiUpdateCustomerById} from 'api/customer'
import { formatDate } from 'utils/dateTimeFun';
import {lang} from 'services/config'
import EditableRowTable from 'components/Table/EditableRowTable';
import { requiredRule } from 'utils/validationFunc';
import BooleanIcon from 'components/Icon/BooleanIcon';
import { getFullName, makeJSVariableName } from 'utils/dataFunc';
import { DEFAULT_PAGINATION, CUSTOMER_FIELD_NAMES } from 'config/contstants';
import { getFilterQuery, getPaginationQuery, getSortQuery } from 'utils/appFunc';

const CustomerListPage =({customer, dispatch, auth, history})=>{
  const defaultColumns = [
    {
      key: 'name',
      type:'name',
      editable:true,
      customFilter:true,
      multiSorter:true,
      rules:[requiredRule]
    },
    {
      key: 'address',
      editable:true,
      multiSorter:true,
      customFilter:true,
      type:'name',
    },
    {
      key: 'mobile_phone',
      editable:true,
      multiSorter:true,
      customFilter:true,
      type:'phone',
    },
    {
      key: 'home_phone',
      editable:true,
      multiSorter:true,
      customFilter:true,
      type:'phone',
    },
    {
      key: 'office_phone',
      editable:true,
      multiSorter:true,
      customFilter:true,
      type:'phone',
    },
    {
      key: 'other_phone',
      editable:true,
      multiSorter:true,
      customFilter:true,
      type:'phone',
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
      key: 'user_id',
      title: lang.author,
      dataIndex: 'user',
      multiSorter:true,
      ellipsis: true,
      render: value=> getFullName(value)
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
  const [selectedFields, setSelectedFields]=useState(CUSTOMER_FIELD_NAMES)
  const [pagination, setPagination]=useState(DEFAULT_PAGINATION);
  const [filters, setFilters]=useState()
  const [sorters, setSorters]=useState()

  const getCustomers=async()=>{
    const query = {
      ...filters&&filters,
      ...sorters&&sorters,
      ...pagination&&pagination,
    }
    const resCustomers = await apiGetCustomers(query)
    if(resCustomers&& !resCustomers.error){
      dispatch(setcustomers(resCustomers.data))
    }
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
    let resCustomer;
    if(!_customer.id){
      resCustomer= await apiCreateCustomer(draft)
    }else{
      resCustomer = await apiUpdateCustomerById(_customer.id, draft)
    }
    if(resCustomer&&!resCustomer.error){
      if(_customer.id){
        dispatch(updatecustomer(resCustomer.data))
      }else{
        dispatch(addcustomer(resCustomer.data))
        dispatch(deletecustomer(0))
      }
    }else{
      resCustomer.error&& setError(resCustomer.error)
    }
    
  }

  const handleDelete =async(id)=>{
    if(id===0){
      dispatch(deletecustomer(id))
    }else{
      const resCustomer = await apiDeleteCustomerById(id)
      if(resCustomer&&!resCustomer.error){
        dispatch(updatecustomer(resCustomer.data))
      }
    }
  }

  const handleRestore =async(id)=>{
    const resCustomer = await apiRestoreCustomerById(id)
    if(resCustomer&&!resCustomer.error){
      dispatch(updatecustomer(resCustomer.data))
    }
  }

  const handlePermanentDelete =async(id)=>{
    const resProduct = await apiPermanentDeleteCustomerById(id)
    if(resProduct&&!resProduct.error){
      dispatch(deletecustomer(resProduct.data))
    }
  }

  const handleDetail=(_customer)=>{
    // console.log('supp---', _customer)
    // console.log('history---', history)
    history.push('/product')
    history.push({pathname:'/customer/detail', state:{customer:_customer}})
  }

  useEffect(()=>{
    getCustomers()
  },[pagination.page_size, pagination.current, filters, sorters])

  useEffect(()=>{
    setColumns(defaultColumns.filter(column=>selectedFields.includes(column.key)))
  },[selectedFields])


  return(
    <Fragment>
      <PageHeader
        title={lang.customers}
        extra={[
          <Select mode='tags' maxTagCount={4} value={selectedFields} style={{minWidth:100}} onChange={handleSelectFields} >
            {CUSTOMER_FIELD_NAMES.map(fieldName=>(
              <Select.Option  key={fieldName} value={fieldName}>{lang[makeJSVariableName(fieldName)]}</Select.Option>
            ))}
          </Select>
        ]}
      />
      <EditableRowTable
        addButtonLabel={lang.createNewcustomer}
        dataSource={customer.customers}
        onCreate={()=>dispatch(addcustomer())}
        onSave={handleSave}
        onDelete={handleDelete}
        onRestore={handleRestore}
        onPermanentDelete={handlePermanentDelete}
        error={error}
        userId={auth.employee.id}
        editable={auth.employee.role==='manager'}
        columns={columns}
        onChange={handleChangeTable}
        onViewDetail={handleDetail}
        pagination={{
          showSizeChanger: true, 
          pageSizeOptions: ["6","8","10","15","20"], 
          total:pagination.total,
          pageSize: pagination.page_size
        }}
      />
    </Fragment>
  )}

CustomerListPage.propTypes = {
  customer: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
};
  
const mapStateToProps = (state) => ({
  customer: typeof state.get('customer').toJS === 'function' ? state.get('customer').toJS() : state.get('customer'),
  auth: typeof state.get('auth').toJS === 'function' ? state.get('auth').toJS() : state.get('auth'),
});

export default connect (mapStateToProps)(CustomerListPage)