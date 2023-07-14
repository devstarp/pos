import React, { Fragment, useEffect, useState } from 'react';
import { PageHeader, Select } from 'antd'
import { connect } from 'react-redux';
import {lang} from 'services/config'
import PropTypes from 'prop-types';
import { addPurchaseItem, deletePurchaseItem, setPurchaseItems, updatePurchaseItem } from 'redux/slices/purchase';
import { formatDate } from 'utils/dateTimeFun';
import EditableRowTable from 'components/Table/EditableRowTable';
import { CURRENCIES, DEFAULT_PAGINATION, PURCHASE_ITEM_FIELD_NAMES } from 'config/contstants';
import { apiGetSuppliers } from 'api/supplier';
import { setSuppliers } from 'redux/slices/supplier';
import { getQuery } from 'utils/productFunc';
import { getFullName, makeJSVariableName } from 'utils/dataFunc';
import { numberRule, requiredRule } from 'utils/validationFunc';
import { apiCreatePurchaseItem, apiDeletePurchaseItemById, apiGetPurchaseItems, apiPermanentDeletePurchaseItemById, apiRestorePurchaseItemById, apiUpdatePurchaseItemById } from 'api/purchaseItem';
import { getFieldsOptions, getFilterQuery, getPaginationQuery, getSortQuery } from 'utils/appFunc';
import BooleanIcon from 'components/Icon/BooleanIcon';

const PurchaseItemListPage=({dispatch,  purchase, auth, supplier})=>{
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
      key: 'purchase_id',
      title: lang.purchase,
      dataIndex: ['purchase', 'order_number'],
      editable:true, 
      inputType:'select',
      options:purchase.purchases,
      ellipsis: true,
      customFilter:true,
      multiSorter:true,
      rules:[requiredRule]
    },
    {
      key: 'supplier_id',
      title: lang.supplier,
      dataIndex: ['supplier', 'name'],
      editable:true, 
      inputType:'select',
      options:supplier.suppliers,
      customFilter:true,
      filterType:'checkGroup',
      multiSorter:true,
      rules:[requiredRule]
    },
    {
      key: 'author',
      multiSorter:true,
      ellipsis: true,
      render: value=> getFullName(value),
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
  const [selectedFields, setSelectedFields]=useState(PURCHASE_ITEM_FIELD_NAMES)
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


  const handleSave=async(draft, _purchaseItem)=>{
    let resPurchaseItem;
    if(!_purchaseItem.id){
      resPurchaseItem= await apiCreatePurchaseItem(draft)
    }else{
      resPurchaseItem = await apiUpdatePurchaseItemById(_purchaseItem.id, draft)
    }
    if(resPurchaseItem&&!resPurchaseItem.error){
      if(_purchaseItem.id){
        dispatch(updatePurchaseItem(resPurchaseItem.data))
      }else{
        dispatch(addPurchaseItem(resPurchaseItem.data))
        dispatch(deletePurchaseItem(0))
      }
    }else{
      resPurchaseItem.error&& setError(resPurchaseItem.error)
    }
  }

  const handleDelete =async(id)=>{
    if(id===0){
      dispatch(deletePurchaseItem(id))
    }else{
      const resPurchaseItem = await apiDeletePurchaseItemById(id)
      if(resPurchaseItem&&!resPurchaseItem.error){
        dispatch(deletePurchaseItem(resPurchaseItem.data))
      }
    }
  }

  const handleRestore =async(id)=>{
    const resPurchaseItem = await apiRestorePurchaseItemById(id)
    if(resPurchaseItem&&!resPurchaseItem.error){
      dispatch(updatePurchaseItem(resPurchaseItem.data))
    }
  }

  const handlePermanentDelete =async(id)=>{
    const resPurchaseItem = await apiPermanentDeletePurchaseItemById(id)
    if(resPurchaseItem&&!resPurchaseItem.error){
      dispatch(deletePurchaseItem(resPurchaseItem.data))
    }
  }

  const getPurchaseItems=async()=>{
    const query = {
      ...filters&&filters,
      ...sorters&&sorters,
      ...pagination&&pagination,
    }
    const resPurchaseItems = await apiGetPurchaseItems(query)
    if(resPurchaseItems && !resPurchaseItems.error){
      dispatch(setPurchaseItems(resPurchaseItems.data))
    }
  }

  const getSuppliers=async()=>{
    const resSuppliers = await apiGetSuppliers()
    if(resSuppliers&& !resSuppliers.error){
      dispatch(setSuppliers(resSuppliers.data))
    }
  }

  useEffect(()=>{
    getSuppliers()
    // getFields()
  },[])
  
  useEffect(()=>{
    getPurchaseItems()
  },[pagination.page_size, pagination.current, filters, sorters])


  useEffect(()=>{
    setColumns(defaultColumns.filter(column=>selectedFields.includes(column.key)))
  },[selectedFields])


  return (
    <Fragment>
      <PageHeader
        title={lang.purchaseItems}
        extra={[
          <Select mode='tags' maxTagCount={4} value={selectedFields} style={{minWidth:100}} onChange={handleSelectFields} >
            {getFieldsOptions( PURCHASE_ITEM_FIELD_NAMES).map(field=>(
              <Select.Option  key={field.id} value={field.id}>{field.title}</Select.Option>
            ))}
          </Select>
        ]}
      />
      <EditableRowTable
        addButtonLabel={lang.createNewPurchaseItem}
        dataSource={purchase.purchaseItems}
        onCreate={()=>dispatch(addPurchaseItem())}
        onSave={handleSave}
        onDelete={handleDelete}
        onRestore={handleRestore}
        onPermanentDelete={handlePermanentDelete}
        error={error}
        employeeID={auth.employee.id}
        editable={auth.employee.position==='MANAGER'}
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

PurchaseItemListPage.propTypes = {
  purchase: PropTypes.object.isRequired,
  supplier: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
};
    
const mapStateToProps = (state) => ({
  purchase: typeof state.get('purchase').toJS === 'function' ? state.get('purchase').toJS() : state.get('purchase'),
  supplier: typeof state.get('supplier').toJS === 'function' ? state.get('supplier').toJS() : state.get('supplier'),
  auth: typeof state.get('auth').toJS === 'function' ? state.get('auth').toJS() : state.get('auth'),
});

export default connect (mapStateToProps)(PurchaseItemListPage)
