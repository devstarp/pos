import React, { Fragment, useEffect, useState } from 'react';
import { PageHeader, Select } from 'antd'
import { connect } from 'react-redux';
import {lang} from 'services/config'
import PropTypes from 'prop-types';
import { formatDate } from 'utils/dateTimeFun';
import EditableRowTable from 'components/Table/EditableRowTable';
import { CURRENCIES, DEFAULT_PAGINATION, SALE_ITEM_FIELD_NAMES } from 'config/contstants';
import { apiGetCustomers } from 'api/customer';
import { makeJSVariableName } from 'utils/dataFunc';
import { numberRule, requiredRule } from 'utils/validationFunc';
import { getFieldsOptions, getFilterQuery, getPaginationQuery, getSortQuery } from 'utils/appFunc';
import BooleanIcon from 'components/Icon/BooleanIcon';
import { apiCreateSaleItem, apiGetSaleItems } from 'api/saleItem';
import { apiDeleteSaleById, apiPermanentDeleteSaleById, apiRestoreSaleById, apiUpdateSaleById } from 'api/sale';
import { addSaleItem, deleteSaleItem, setSaleItems, updateSaleItem } from 'redux/slices/sale';
import { setCustomers } from 'redux/slices/customer';

const SaleItemListPage=({dispatch,  sale, auth, customer})=>{
  const defaultColumns = [
    {
      key: 'product_id',
      title: lang.product,
      dataIndex: ['product', 'name'],
      // editable:true, 
      // inputType:'select',
      // filterType:'checkGroup',
      // customFilter:true,
      // multiSorter:true,
      // options:product.suppliers,
      rules:[requiredRule]
    },
    {
      key: 'sale_id',
      title: lang.sale,
      dataIndex: ['sale', 'order_number'],
      editable:true, 
      inputType:'select',
      options:sale.sales,
      ellipsis: true,
      customFilter:true,
      multiSorter:true,
      rules:[requiredRule]
    },
    {
      key: 'customer_id',
      title: lang.customer,
      dataIndex: ['customer', 'name'],
      editable:true, 
      inputType:'select',
      options:customer.customers,
      customFilter:true,
      filterType:'checkGroup',
      multiSorter:true,
      rules:[requiredRule]
    },
    {
      key: 'quantity',
      editable:true,
      inputType:'number',
      filterType:'numberRange',
      customFilter:true,
      multiSorter:true,
      rules:[requiredRule, numberRule]
    },
    {
      key: 'price',
      editable:true,
      inputType:'number',
      filterType:'numberRange',
      customFilter:true,
      multiSorter:true,
      rules:[requiredRule, numberRule]
    },
    {
      key: 'total',
      editable:true,
      inputType:'number',
      filterType:'numberRange',
      customFilter:true,
      multiSorter:true,
      rules:[requiredRule, numberRule]
    },
    {
      key: 'currency_rate',
      editable:true,
      inputType:'number',
      filterType:'numberRange',
      customFilter:true,
      multiSorter:true,
      rules:[requiredRule, numberRule],
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
  const [error, setError]=useState([])
  const [columns, setColumns]=useState(defaultColumns)
  const [selectedFields, setSelectedFields]=useState(SALE_ITEM_FIELD_NAMES)
  const [pagination, setPagination]=useState(DEFAULT_PAGINATION);
  const [filters, setFilters]=useState()
  const [sorters, setSorters]=useState()  

  
  const handleSelectFields=(_fields)=>{
    setSelectedFields(_fields)
  }

  const handleChangeTable=(_pagination, _filters, _sorters)=>{
    setPagination(getPaginationQuery(_pagination))
    setSorters(getSortQuery(_sorters))
    setFilters(getFilterQuery(_filters))
  }


  const handleSave=async(draft, _saleItem)=>{
    let resSaleItem;
    if(!_saleItem.id){
      resSaleItem= await apiCreateSaleItem(draft)
    }else{
      resSaleItem = await apiUpdateSaleById(_saleItem.id, draft)
    }
    if(resSaleItem&&!resSaleItem.error){
      if(_saleItem.id){
        dispatch(updateSaleItem(resSaleItem.data))
      }else{
        dispatch(addSaleItem(resSaleItem.data))
        dispatch(deleteSaleItem(0))
      }
    }else{
      resSaleItem.error&& setError(resSaleItem.error)
    }
  }

  const handleDelete =async(id)=>{
    if(id===0){
      dispatch(deleteSaleItem(id))
    }else{
      const resSaleItem = await apiDeleteSaleById(id)
      if(resSaleItem&&!resSaleItem.error){
        dispatch(updateSaleItem(resSaleItem.data))
      }
    }
  }

  const handleRestore =async(id)=>{
    const resSaleItem = await apiRestoreSaleById(id)
    if(resSaleItem&&!resSaleItem.error){
      dispatch(updateSaleItem(resSaleItem.data))
    }
  }

  const handlePermanentDelete =async(id)=>{
    const resSaleItem = await apiPermanentDeleteSaleById(id)
    if(resSaleItem&&!resSaleItem.error){
      dispatch(deleteSaleItem(resSaleItem.data))
    }
  }

  const getSaleItems=async()=>{
    const query = {
      ...filters&&filters,
      ...sorters&&sorters,
      ...pagination&&pagination,
    }
    const resSaleItems = await apiGetSaleItems(query)
    if(resSaleItems && !resSaleItems.error){
      dispatch(setSaleItems(resSaleItems.data))
    }
  }

  const getCustomers=async()=>{
    const resCustomers = await apiGetCustomers()
    if(resCustomers&& !resCustomers.error){
      dispatch(setCustomers(resCustomers.data))
    }
  }

  useEffect(()=>{
    getCustomers()
  },[])
  
  useEffect(()=>{
    getSaleItems()
  },[pagination.page_size, pagination.current, filters, sorters])


  useEffect(()=>{
    setColumns(defaultColumns.filter(column=>selectedFields.includes(column.key)))
  },[selectedFields])

  return (
    <Fragment>
      <PageHeader
        title={lang.saleItems}
        extra={[
          <Select mode='tags' maxTagCount={4} value={selectedFields} style={{minWidth:100}} onChange={handleSelectFields} >
            {SALE_ITEM_FIELD_NAMES.map(fieldName=>(
              <Select.Option  key={fieldName} value={fieldName}>{lang[makeJSVariableName(fieldName)]}</Select.Option>
            ))}
          </Select>
        ]}
      />
      <EditableRowTable
        addButtonLabel={lang.createNewPurchaseItem}
        dataSource={sale.saleItems}
        onCreate={()=>dispatch(addSaleItem())}
        onSave={handleSave}
        onDelete={handleDelete}
        onRestore={handleRestore}
        onPermanentDelete={handlePermanentDelete}
        error={error}
        userId={auth.employee.id}
        columns={columns}
        onChange={handleChangeTable}
        pagination={{
          showSizeChanger: true, 
          pageSizeOptions: ["6","8","10","15","20"], 
          total:pagination.total,
          pageSize: pagination.page_size
        }}
      />
    </Fragment>
  )}

SaleItemListPage.propTypes = {
  sale: PropTypes.object.isRequired,
  customer: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
};
    
const mapStateToProps = (state) => ({
  sale: typeof state.get('sale').toJS === 'function' ? state.get('sale').toJS() : state.get('sale'),
  customer: typeof state.get('customer').toJS === 'function' ? state.get('customer').toJS() : state.get('customer'),
  auth: typeof state.get('auth').toJS === 'function' ? state.get('auth').toJS() : state.get('auth'),
});

export default connect (mapStateToProps)(SaleItemListPage)
