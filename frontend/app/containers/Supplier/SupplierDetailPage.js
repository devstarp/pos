import React, { Component, Fragment, useEffect, useState } from 'react';
import { Descriptions, PageHeader, Select } from 'antd'
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { addSupplier, setSuppliers, deleteSupplier, updateSupplier, setSupplier, } from 'redux/slices/supplier'
import {apiCreateSupplier, apiDeleteSupplierById, apiGetSupplierById, apiGetSuppliers, apiPermanentDeleteSupplierById, apiRestoreSupplierById, apiUpdateSupplierById} from 'api/supplier'
import { formatDate } from 'utils/dateTimeFun';
import {lang} from 'services/config'
import EditableRowTable from 'components/Table/EditableRowTable';
import { requiredRule, numberRule } from 'utils/validationFunc';
import BooleanIcon from 'components/Icon/BooleanIcon';
import { getFullName, makeJSVariableName } from 'utils/dataFunc';
import { CURRENCIES, DEFAULT_PAGINATION, SUPPLIER_FIELD_NAMES } from 'config/contstants';
import { getFilterQuery, getPaginationQuery, getSortQuery } from 'utils/appFunc';
import { apiGetPurchases } from 'api/purchase';
import { get } from 'lodash';

const SupplierDetailPage =({supplier, dispatch, auth, history})=>{
  const defaultSupplier = get(history, 'location.state.supplier') || {}
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
      // options:defaultSuppliers,
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
  const [selectedFields, setSelectedFields]=useState(SUPPLIER_FIELD_NAMES)
  const [pagination, setPagination]=useState(DEFAULT_PAGINATION);
  const [filters, setFilters]=useState()
  const [sorters, setSorters]=useState();
  const [purchases, setPurchases]=useState([])

  const getSupplier=async()=>{
    const resSupplier = await apiGetSupplierById(defaultSupplier.id,{includes: 'purchase,purchase_item'})
    if(resSupplier&& !resSupplier.error){
      dispatch(setSupplier(resSupplier.data))
      setPurchases(resSupplier.data.purchases)
    }
  }

  const getPurchases = async()=>{
    // const resPurchases = await apiGetPurchases(getQuery(values))
    // if(resPurchases && !resPurchases.error){
    //   dispatch(setPurchases(resPurchases.data))
    // }
  }

  useEffect(()=>{
    getSupplier()
  },[])

  useEffect(()=>{
    getPurchases()
  },[ pagination.page_size, pagination.current, filters, sorters])

  useEffect(()=>{
    setColumns(defaultColumns.filter(column=>selectedFields.includes(column.key)))
  },[selectedFields])

  return(
    <Fragment>
      <PageHeader
        title={lang.suppliers}
        subTitle={defaultSupplier.name}
        // extra={[
        //   <Select mode='tags' maxTagCount={4} value={selectedFields} style={{minWidth:100}} onChange={handleSelectFields} >
        //     {fieldSelects.map(field=>(
        //       <Select.Option  key={field.id} value={field.id}>{field.title}</Select.Option>
        //     ))}
        //   </Select>
        // ]}
      >
        <Descriptions size="small" column={3}>
          <Descriptions.Item label="ID">{defaultSupplier.id}</Descriptions.Item>
          <Descriptions.Item label="Name">{defaultSupplier.name}</Descriptions.Item>
          <Descriptions.Item label="Mobile Phone">{defaultSupplier.mobile_phone}</Descriptions.Item>
          <Descriptions.Item label="Home Phone">{defaultSupplier.home_phone}</Descriptions.Item>
          <Descriptions.Item label="Office Phone">{defaultSupplier.office_phone}</Descriptions.Item>
          <Descriptions.Item label="Other Phone">{defaultSupplier.other_phone}</Descriptions.Item>
          <Descriptions.Item label="New">
            <BooleanIcon value={defaultSupplier.new} />
          </Descriptions.Item>
          <Descriptions.Item label="Editable">
            <BooleanIcon value={defaultSupplier.editable} />
          </Descriptions.Item>
          <Descriptions.Item label="Enabled">
            <BooleanIcon value={defaultSupplier.enabled} />
          </Descriptions.Item>
          <Descriptions.Item label="Created Date">{formatDate(defaultSupplier.created_at)}</Descriptions.Item>
          <Descriptions.Item label="Created Date">{formatDate(defaultSupplier.updated_at)}</Descriptions.Item>
          <Descriptions.Item label="Created Date">{formatDate(defaultSupplier.deleted_at)}</Descriptions.Item>
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

SupplierDetailPage.propTypes = {
  supplier: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
};
  
const mapStateToProps = (state) => ({
  supplier: typeof state.get('supplier').toJS === 'function' ? state.get('supplier').toJS() : state.get('supplier'),
  auth: typeof state.get('auth').toJS === 'function' ? state.get('auth').toJS() : state.get('auth'),
});

export default connect (mapStateToProps)(SupplierDetailPage)