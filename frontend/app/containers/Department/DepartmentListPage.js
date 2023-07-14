import React, { Fragment, useEffect, useState } from 'react';
import { PageHeader, Select } from 'antd'
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {lang} from 'services/config'
import { formatDate } from 'utils/dateTimeFun';
import EditableRowTable from 'components/Table/EditableRowTable';
import BooleanIcon from 'components/Icon/BooleanIcon'
import { isChangedObject } from 'utils/dataFunc';
import { getFieldsOptions, getFilterQuery, getPaginationQuery, getSortQuery } from 'utils/appFunc';
import { CURRENCIES, DEFAULT_PAGINATION, DEPARTMENTS, DEPARTMENT_FIELD_NAMES } from 'config/contstants';
import { apiCreateDepartment, apiDeleteDepartmentById, apiGetDepartments, apiPermanentDeleteDepartmentById, apiRestoreDepartmentById, apiUpdateDepartmentById } from 'api/department';
import { addDepartment, deleteDepartment, setDepartments, updateDepartment } from 'redux/slices/department';

const DepartmentListPage=({dispatch, department, auth})=>{
  const defaultColumns = [
    {
      key: 'role',
      type:'code',
      // editable:true,
      inputType:'select',
      filterType:'checkGroup',
      customFilter:true,
      options:DEPARTMENTS,
      multiSorter:true,
      width: 100,
    },
    {
      key: 'name',
      type:'name',
      customFilter:true,
      editable:true,
      multiSorter:true,
    },
    {
      key: 'leader',
      type:'code',
      dataIndex:  ['leader', 'full_name'],
      editable:true,
      inputType:'select',
      filterType:'checkGroup',
      options:department.departments,
      customFilter:true,
      multiSorter:true,
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
      key: 'address',
      editable:true,
      multiSorter:true,
      customFilter:true,
      type:'address',
    },
    {
      key: 'email',
      editable:true,
      multiSorter:true,
      customFilter:true,
      type:'address',
    },
    {
      key: 'phone',
      editable:true,
      multiSorter:true,
      customFilter:true,
      type:'address',
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
  const [selectedFields, setSelectedFields]=useState(DEPARTMENT_FIELD_NAMES)
  const [pagination, setPagination]=useState(DEFAULT_PAGINATION);
  const [filters, setFilters]=useState()
  const [sorters, setSorters]=useState()

  const handleSelectFields=(_fields)=>{
    setSelectedFields(_fields)
  }

  const handleSaveDepartment=async(draft, _department)=>{
    let resDepartment = {}
    if(!_department.id){
      resDepartment = await apiCreateDepartment(draft);
    }else if(isChangedObject( draft,_department)){
      resDepartment = await apiUpdateDepartmentById(_department.id, draft);
    }
    if(resDepartment&& !resDepartment.error){
      if(_department.id){
        dispatch(updateDepartment(resDepartment.data))
      }else{
        dispatch(addDepartment(resDepartment.data))
        dispatch(deleteDepartment(0))
      }
    }else{
      resDepartment.error&& setError(resDepartment.error)
    }
  }

  const handleDeleteDepartment =async(id)=>{
    if(id===0){
      dispatch(deleteDepartment(id))
    }else{
      const resDepartment = await apiDeleteDepartmentById(id)
      if(resDepartment&&!resDepartment.error){
        dispatch(deleteDepartment(resDepartment.data))
      }
    }
  }

  const handleRestoreDepartment =async(id)=>{
    const resDepartment = await apiRestoreDepartmentById(id)
    if(resDepartment&&!resDepartment.error){
      dispatch(updateDepartment(resDepartment.data))
    }
  }

  const handlePermanentDeleteDepartment =async(id)=>{
    const resDepartment = await apiPermanentDeleteDepartmentById(id)
    if(resDepartment&&!resDepartment.error){
      dispatch(deleteDepartment(resDepartment.data))
    }
  }

  const handleChangeTable=(_pagination, _filters, _sorters)=>{
    setPagination(getPaginationQuery(_pagination))
    setSorters(getSortQuery(_sorters))
    setFilters(getFilterQuery(_filters))
  }

  const getDepartments=async()=>{
    const query = {
      ...filters&&filters,
      ...sorters&&sorters,
      ...pagination&&pagination,
    }

    const resDepartments = await apiGetDepartments(query)
    if(resDepartments && !resDepartments.error){
      dispatch(setDepartments(resDepartments.data))
      setPagination(resDepartments.meta)
    }else{
      dispatch(setDepartments([]))
    }
  }

  useEffect(()=>{
    getDepartments()
  },[pagination.page_size, pagination.current, filters, sorters])

  useEffect(()=>{
    setColumns(defaultColumns.filter(column=>selectedFields.includes(column.key)))
  },[selectedFields])

  return (
    <Fragment>
      <PageHeader
        title={lang.department}
        extra={[
          <Select mode='tags' maxTagCount={4} value={selectedFields} style={{minWidth:100}} onChange={handleSelectFields} >
            {getFieldsOptions( DEPARTMENT_FIELD_NAMES).map(field=>(
              <Select.Option  key={field.id} value={field.id}>{field.title}</Select.Option>
            ))}
          </Select>
        ]}
      />
      <EditableRowTable
        dataSource={department.departments}
        selectedData={department.department}
        onSave={handleSaveDepartment}
        size='small'
        columns={columns}
        onCreate={()=>dispatch(addDepartment())}
        onDelete={handleDeleteDepartment}
        onRestore={handleRestoreDepartment}
        onPermanentDelete={handlePermanentDeleteDepartment}
        addButtonLabel={lang.createNewDepartment}
        employeeID={auth.employee.id}
        editable={auth.employee.position==='MANAGER'}
        error={error}
        onChange={handleChangeTable}
        pagination={{
          showSizeChanger: true, 
          pageSizeOptions: ["6","8","10","15","20"], 
          total:pagination.total,
          pageSize: pagination.page_size
        }}
      />
    </Fragment>
  )
}

DepartmentListPage.propTypes = {
  department: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  department: typeof state.get('department').toJS === 'function' ? state.get('department').toJS() : state.get('department'),
  auth: typeof state.get('auth').toJS === 'function' ? state.get('auth').toJS() : state.get('auth'),
});

export default connect (mapStateToProps)(DepartmentListPage)
