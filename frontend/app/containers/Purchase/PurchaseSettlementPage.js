import React, { Fragment, useEffect, useState } from 'react';
import { Button, PageHeader, Select, Statistic } from 'antd'
import { connect } from 'react-redux';
import {lang} from 'services/config'
import PropTypes from 'prop-types';
import { apiCreatePurchase, apiDeletePurchaseById, apiGetPurchases, apiGetPurchaseStatistics, apiPermanentDeletePurchaseById, apiRestorePurchaseById, apiUpdatePurchaseById, apiUpdatePurchasesByIds } from 'api/purchase';
import { addPurchase, deletePurchase, setPurchases, updatePurchase, updatePurchases } from 'redux/slices/purchase';
import { DATE_TIME_FORMAT_2, DATE_TIME_FORMAT_1,formatDate } from 'utils/dateTimeFun';
import EditableRowTable from 'components/Table/EditableRowTable';
import { CURRENCIES, DEFAULT_PAGINATION, PURCHASE_FIELD_NAMES } from 'config/contstants';
import { apiGetSuppliers } from 'api/supplier';
import { setSuppliers } from 'redux/slices/supplier';
import { getFullName } from 'utils/dataFunc';
import { numberRule, requiredRule } from 'utils/validationFunc';
import { getFieldsOptions, getFilterQuery, getPaginationQuery, getSortQuery } from 'utils/appFunc';
import BooleanIcon from 'components/Icon/BooleanIcon';
import moment from 'moment';
import { get, isArray } from 'lodash-es';

const PurchaseSettlementPage=({dispatch,  purchase, auth, supplier})=>{
  const defaultColumns = [
    {
      key: 'order_number',
      ellipsis: true,
      customFilter:true,
      multiSorter:true,
    },
    {
      key: 'supplier_id',
      title: lang.supplier,
      dataIndex: ['supplier', 'name'],
      editable:true, 
      inputType:'select',
      filterType:'checkGroup',
      customFilter:true,
      multiSorter:true,
      options:supplier.suppliers,
      rules:[requiredRule]
    },
    {
      key: 'author',
      multiSorter:true,
      ellipsis: true,
      render: value=> getFullName(value),
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
      filterType: 'timeRange',
      multiSorter:true,
      render: (date) => formatDate(date, DATE_TIME_FORMAT_1)
    },
    {
      key: 'updated_at',
      type:'date',
      customFilter:true,
      filterType: 'timeRange',
      multiSorter:true,
      render: (date) => formatDate(date, DATE_TIME_FORMAT_1)
    },
    {
      key: 'deleted_at',
      type:'date',
      customFilter:true,
      filterType: 'timeRange',
      multiSorter:true,
      render: (date) => formatDate(date)
    },
  ]
  const [error, setError]=useState([])
  const [columns, setColumns]=useState(defaultColumns)
  const [selectedFields, setSelectedFields]=useState(PURCHASE_FIELD_NAMES)
  const [pagination, setPagination]=useState(DEFAULT_PAGINATION);
  const [filters, setFilters]=useState()
  const [sorters, setSorters]=useState()
  const [statistics, setStatistics]=useState()

  const handleSave=async(draft, _purchase)=>{
    let resPurchase;
    if(!_purchase.id){
      resPurchase= await apiCreatePurchase(draft)
    }else{
      resPurchase = await apiUpdatePurchaseById(_purchase.id, draft)
    }
    if(resPurchase&&!resPurchase.error){
      if(_purchase.id){
        dispatch(updatePurchase(resPurchase.data))
      }else{
        dispatch(addPurchase(resPurchase.data))
        dispatch(deletePurchase(0))
      }
    }else{
      resPurchase.error&& setError(resPurchase.error)
    }
  }

  const handleDelete =async(id)=>{
    if(id===0){
      dispatch(deletePurchase(id))
    }else{
      const resPurchase = await apiDeletePurchaseById(id)
      if(resPurchase&&!resPurchase.error){
        dispatch(deletePurchase(resPurchase.data))
      }
    }
  }

  const handleRestore =async(id)=>{
    const resPurchase = await apiRestorePurchaseById(id)

    if(resPurchase&&!resPurchase.error){
      dispatch(updatePurchase(resPurchase.data))
    }
  }

  const handlePermanentDelete =async(id)=>{
    const resProduct = await apiPermanentDeletePurchaseById(id)
    if(resProduct&&!resProduct.error){
      dispatch(deletePurchase(resProduct.data))
    }
  }

  const handleSelectFields=(_fields)=>{
    setSelectedFields(_fields)
  }

  const handleSettlement = async()=>{
    const ids=purchase.purchases.map(_purchase=>_purchase.id).join(',')
    const resPurchases = await apiUpdatePurchasesByIds(ids, {editable:false})
    if(resPurchases&&!resPurchases.error){
      dispatch(updatePurchases(resPurchases.data))
    }
  }

  const handleChangeTable=(_pagination, _filters, _sorters)=>{
    setPagination(getPaginationQuery(_pagination))
    setSorters(getSortQuery(_sorters))
    setFilters(getFilterQuery(_filters))
  }

  const getPurchases=async()=>{
    const query = {
      created_at_from:moment(new Date()).startOf('date').format(DATE_TIME_FORMAT_2),
      created_at_to:moment(new Date()).endOf('date').format(DATE_TIME_FORMAT_2),
      author_id:auth.employee.id,
      ...filters&&filters,
      ...sorters&&sorters,
      ...pagination&&pagination,
    }

    const resPurchases = await apiGetPurchases(query)
    if(resPurchases && !resPurchases.error){
      dispatch(setPurchases(resPurchases.data))
    }
  }

  const getStatistics =async()=>{
    const query = {
      created_at_from:moment(new Date()).startOf('date').format(DATE_TIME_FORMAT_2),
      created_at_to:moment(new Date()).endOf('date').format(DATE_TIME_FORMAT_2),
    }
    const resStatistics= await apiGetPurchaseStatistics(query)
    if(resStatistics&&!resStatistics.error){
      setStatistics(resStatistics.data)
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
    getStatistics()
  },[])
  
  useEffect(()=>{
    getPurchases()
  },[pagination.page_size, pagination.current, filters, sorters])

  useEffect(()=>{
    setColumns(defaultColumns.filter(column=>selectedFields.includes(column.key)))
  },[selectedFields])

  return (
    <Fragment>
      <PageHeader
        title={lang.purchases}
        extra={[
          <Select mode='tags' maxTagCount={4} value={selectedFields} style={{minWidth:100}} onChange={handleSelectFields} >
            {getFieldsOptions(PURCHASE_FIELD_NAMES).map(field=>(
              <Select.Option  key={field.id} value={field.id}>{field.title}</Select.Option>
            ))}
          </Select>
        ]}
      />
      {isArray(statistics)&& statistics.map(stat=> (
        <Statistic
          title={stat.currency}
          value={stat.total_amount}
        />
      ))}
      <EditableRowTable
        dataSource={purchase.purchases}
        onSave={handleSave}
        onDelete={handleDelete}
        onRestore={handleRestore}
        onPermanentDelete={handlePermanentDelete}
        onChange={handleChangeTable}
        error={error}
        employeeID={auth.employee.id}
        editable={auth.employee.position==='MANAGER'}
        columns={columns}
        pagination={{
          showSizeChanger: true, 
          pageSizeOptions: ["6","8","10","15","20"], 
          total:pagination.total,
          pageSize: pagination.page_size
        }}
      />
      <Button onClick={handleSettlement} disabled={!isArray(purchase.purchases)}>Settlement</Button>
    </Fragment>
  )}

PurchaseSettlementPage.propTypes = {
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

export default connect (mapStateToProps)(PurchaseSettlementPage)
