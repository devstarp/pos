import React, { Component, Fragment, useEffect, useState } from 'react';
import { PageHeader, Select } from 'antd'
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { addSupplier, setSuppliers, deleteSupplier, updateSupplier, } from 'redux/slices/supplier'
import {apiCreateSupplier, apiDeleteSupplierById, apiGetSuppliers, apiPermanentDeleteSupplierById, apiRestoreSupplierById, apiUpdateSupplierById} from 'api/supplier'
import { formatDate } from 'utils/dateTimeFun';
import {lang} from 'services/config'
import EditableRowTable from 'components/Table/EditableRowTable';
import { requiredRule } from 'utils/validationFunc';
import BooleanIcon from 'components/Icon/BooleanIcon';
import { getFullName, makeJSVariableName } from 'utils/dataFunc';
import { DEFAULT_PAGINATION, SUPPLIER_FIELD_NAMES } from 'config/contstants';
import { getFilterQuery, getPaginationQuery, getSortQuery } from 'utils/appFunc';

const SupplierListPage =({supplier, dispatch, auth, history})=>{
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
      key: 'description',
      editable:true,
      multiSorter:true,
      customFilter:true,
      type:'name',
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
  const [selectedFields, setSelectedFields]=useState(SUPPLIER_FIELD_NAMES)
  const [pagination, setPagination]=useState(DEFAULT_PAGINATION);
  const [filters, setFilters]=useState()
  const [sorters, setSorters]=useState()

  const getSuppliers=async()=>{
    const query = {
      ...filters&&filters,
      ...sorters&&sorters,
      ...pagination&&pagination,
    }
    const resSuppliers = await apiGetSuppliers(query)
    if(resSuppliers&& !resSuppliers.error){
      dispatch(setSuppliers(resSuppliers.data))
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

  const handleSave=async(draft, _supplier)=>{
    let resSupplier;
    if(!_supplier.id){
      resSupplier= await apiCreateSupplier(draft)
    }else{
      resSupplier = await apiUpdateSupplierById(_supplier.id, draft)
    }
    if(resSupplier&&!resSupplier.error){
      if(_supplier.id){
        dispatch(updateSupplier(resSupplier.data))
      }else{
        dispatch(addSupplier(resSupplier.data))
        dispatch(deleteSupplier(0))
      }
    }else{
      resSupplier.error&& setError(resSupplier.error)
    }
    
  }

  const handleDelete =async(id)=>{
    if(id===0){
      dispatch(deleteSupplier(id))
    }else{
      const resSupplier = await apiDeleteSupplierById(id)
      if(resSupplier&&!resSupplier.error){
        dispatch(deleteSupplier(resSupplier.data)) 
      }
    }
  }

  const handleRestore =async(id)=>{
    const resSupplier = await apiRestoreSupplierById(id)
    if(resSupplier&&!resSupplier.error){
      dispatch(updateSupplier(resSupplier.data))
    }
  }

  const handlePermanentDelete =async(id)=>{
    const resSupplier = await apiPermanentDeleteSupplierById(id)
    if(resSupplier&&!resSupplier.error){
      dispatch(deleteSupplier(resSupplier.data)) 
    }
  }

  const handleDetail=(_supplier)=>{
    // console.log('supp---', _supplier)
    // console.log('history---', history)
    history.push('/product')
    history.push({pathname:'/supplier/detail', state:{supplier:_supplier}})
  }

  useEffect(()=>{
    getSuppliers()
  },[pagination.page_size, pagination.current, filters, sorters])

  useEffect(()=>{
    setColumns(defaultColumns.filter(column=>selectedFields.includes(column.key)))
  },[selectedFields])

  const fieldSelects= SUPPLIER_FIELD_NAMES.map(fieldName=>({id:fieldName, title: lang[makeJSVariableName(fieldName)]}))

  return(
    <Fragment>
      <PageHeader
        title={lang.suppliers}
        extra={[
          <Select mode='tags' maxTagCount={4} value={selectedFields} style={{minWidth:100}} onChange={handleSelectFields} >
            {fieldSelects.map(field=>(
              <Select.Option  key={field.id} value={field.id}>{field.title}</Select.Option>
            ))}
          </Select>
        ]}
      />
      <EditableRowTable
        addButtonLabel={lang.createNewSupplier}
        dataSource={supplier.suppliers}
        selectedData={supplier.supplier}
        onCreate={()=>dispatch(addSupplier())}
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

SupplierListPage.propTypes = {
  supplier: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
};
  
const mapStateToProps = (state) => ({
  supplier: typeof state.get('supplier').toJS === 'function' ? state.get('supplier').toJS() : state.get('supplier'),
  auth: typeof state.get('auth').toJS === 'function' ? state.get('auth').toJS() : state.get('auth'),
});

export default connect (mapStateToProps)(SupplierListPage)