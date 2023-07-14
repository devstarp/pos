import React, { Fragment, useEffect, useState } from 'react';
import { PageHeader, Select } from 'antd'
import { connect } from 'react-redux';
import {lang} from 'services/config'
import PropTypes from 'prop-types';
import { formatDate } from 'utils/dateTimeFun';
import EditableRowTable from 'components/Table/EditableRowTable';
import { CURRENCIES, DEFAULT_PAGINATION, PURCHASE_FIELD_NAMES, SALE_FIELD_NAMES } from 'config/contstants';
import { apiGetSuppliers } from 'api/supplier';
import { setSuppliers } from 'redux/slices/supplier';
import { getQuery } from 'utils/productFunc';
import { getFullName, makeJSVariableName } from 'utils/dataFunc';
import { numberRule, requiredRule } from 'utils/validationFunc';
import { getFieldsOptions, getFilterQuery, getPaginationQuery, getSortQuery } from 'utils/appFunc';
import BooleanIcon from 'components/Icon/BooleanIcon';
import { apiCreateSale, apiDeleteSaleById, apiGetSales, apiPermanentDeleteSaleById, apiRestoreSaleById, apiUpdateSaleById } from 'api/sale';
import { addSale, deleteSale, setSales, updateSale } from 'redux/slices/sale';

const SaleListPage=({dispatch,  sale, auth, supplier})=>{
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
      options:supplier.suppliers,
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
  const [error, setError]=useState([])
  const [columns, setColumns]=useState(defaultColumns)
  const [selectedFields, setSelectedFields]=useState(SALE_FIELD_NAMES)
  const [pagination, setPagination]=useState(DEFAULT_PAGINATION);
  const [filters, setFilters]=useState()
  const [sorters, setSorters]=useState()
  
  const handleSave=async(draft, _purchase)=>{
    let resSale;
    if(!_purchase.id){
      resSale= await apiCreateSale(draft)
    }else{
      resSale = await apiUpdateSaleById(_purchase.id, draft)
    }
    if(resSale&&!resSale.error){
      if(_purchase.id){
        dispatch(updateSale(resSale.data))
      }else{
        dispatch(addSale(resSale.data))
        dispatch(deleteSale(0))
      }
    }else{
      resSale.error&& setError(resSale.error)
    }
  }

  const handleDelete =async(id)=>{
    if(id===0){
      dispatch(deleteSale(id))
    }else{
      const resSale = await apiDeleteSaleById(id)
      if(resSale&&!resSale.error){
        dispatch(updateSale(resSale.data))
      }
    }
  }

  const handleRestore =async(id)=>{
    const resSale = await apiRestoreSaleById(id)
    if(resSale&&!resSale.error){
      dispatch(updateSale(resSale.data))
    }
  }

  const handlePermanentDelete =async(id)=>{
    const resProduct = await apiPermanentDeleteSaleById(id)
    if(resProduct&&!resProduct.error){
      dispatch(deleteSale(resProduct.data))
    }
  }

  const handleSelectFields=(_fields)=>{
    setSelectedFields(_fields)
  }

  const handleChangeTable=(_pagination, _filters, _sorters)=>{
    console.log('_pagination---', _pagination)
    setPagination(getPaginationQuery(_pagination))
    setSorters(getSortQuery(_sorters))
    setFilters(getFilterQuery(_filters))
  }

  const getSales=async(values)=>{
    const resSales = await apiGetSales(getQuery(values))
    if(resSales && !resSales.error){
      dispatch(setSales(resSales.data))
    }
  }

  const getCustomers=async()=>{
    const resSuppliers = await apiGetSuppliers()
    if(resSuppliers&& !resSuppliers.error){
      dispatch(setSuppliers(resSuppliers.data))
    }
  }

  useEffect(()=>{
    getCustomers()
  },[])

  
  useEffect(()=>{
    getSales()
  },[pagination.page_size, pagination.current, filters, sorters])


  useEffect(()=>{
    setColumns(defaultColumns.filter(column=>selectedFields.includes(column.key)))
  },[selectedFields])


  return (
    <Fragment>
      <PageHeader
        title={lang.sale}
        extra={[
          <Select mode='tags' maxTagCount={4} value={selectedFields} style={{minWidth:100}} onChange={handleSelectFields} >
            {SALE_FIELD_NAMES.map(fieldName=>(
              <Select.Option  key={fieldName} value={fieldName}>{lang[makeJSVariableName(fieldName)]}</Select.Option>
            ))}
          </Select>
        ]}
      />
      <EditableRowTable
        addButtonLabel={lang.createNewPurchase}
        dataSource={sale.sales}
        onCreate={()=>dispatch(addSale())}
        onSave={handleSave}
        onDelete={handleDelete}
        onRestore={handleRestore}
        onPermanentDelete={handlePermanentDelete}
        onChange={handleChangeTable}
        error={error}
        userId={auth.employee.id}
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

SaleListPage.propTypes = {
  sale: PropTypes.object.isRequired,
  supplier: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
};
    
const mapStateToProps = (state) => ({
  sale: typeof state.get('sale').toJS === 'function' ? state.get('sale').toJS() : state.get('sale'),
  supplier: typeof state.get('supplier').toJS === 'function' ? state.get('supplier').toJS() : state.get('supplier'),
  auth: typeof state.get('auth').toJS === 'function' ? state.get('auth').toJS() : state.get('auth'),
});

export default connect (mapStateToProps)(SaleListPage)
