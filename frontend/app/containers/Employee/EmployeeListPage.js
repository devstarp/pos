import React, { Fragment, useEffect, useState } from 'react';
import { PageHeader, Select, Tooltip } from 'antd'
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {lang} from 'services/config'
import { formatDate } from 'utils/dateTimeFun';
import EditableRowTable from 'components/Table/EditableRowTable';
import BooleanIcon from 'components/Icon/BooleanIcon'
import { isChangedObject, makeJSVariableName, getFullName } from 'utils/dataFunc';
import { getFieldsOptions, getFilterQuery, getPaginationQuery, getQuery, getSortQuery } from 'utils/appFunc';
import { numberRule, requiredRule } from 'utils/validationFunc';
import { CURRENCIES, DEFAULT_PAGINATION, EMPLOYEE_FIELD_NAMES, POSITIONS } from 'config/contstants';
import { apiCreateEmployee, apiDeleteEmployeeById, apiGetEmployees, apiPermanentDeleteEmployeeById, apiRestoreEmployeeById, apiUpdateEmployeeById } from 'api/employee';
import { addEmployee, deleteEmployee, setEmployee, setEmployees, updateEmployee } from 'redux/slices/employee';
import { apiGetDepartments } from 'api/department';
import { setDepartments } from 'redux/slices/department';

const EmployeeListPage=({dispatch, employee,  department, auth})=>{
  const defaultColumns = [
    {
      key: 'id',
      title:'ID',
      type:'code',
      inputType:'number',
      editable:true,
      customFilter:true,
      multiSorter:true,
    },
    {
      key: 'department_id',
      type:'code',
      dataIndex:  ['department', 'name'],
      editable:true,
      inputType:'select',
      filterType:'checkGroup',
      options:department.departments,
      customFilter:true,
      multiSorter:true,
    },
    {
      key: 'position',
      type:'code',
      editable:true,
      inputType:'select',
      filterType:'checkGroup',
      customFilter:true,
      options:POSITIONS,
      multiSorter:true,
      width: 100,
    },
    {
      key: 'full_name',
      customFilter:true,
      fixed:'center',
      multiSorter:true,
    },
    {
      key: 'first_name',
      editable:true,
      customFilter:true,
      fixed:'center',
      multiSorter:true,
    },
    {
      key: 'last_name',
      editable:true,
      customFilter:true,
      fixed:'center',
      multiSorter:true,
    },
    {
      key: 'birth_date',
      editable:true,
      type:'date',
      inputType: 'date',
      customFilter:true,
      filterType: 'dateRange',
      multiSorter:true,
      render: (date) => formatDate(date)
    },
    {
      key: 'last_name',
      type:'name',
      editable:true,
      customFilter:true,
      fixed:'center',
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
  const [selectedFields, setSelectedFields]=useState(EMPLOYEE_FIELD_NAMES)
  const [pagination, setPagination]=useState(DEFAULT_PAGINATION);
  const [filters, setFilters]=useState()
  const [sorters, setSorters]=useState()

  const handleSelectFields=(_fields)=>{
    setSelectedFields(_fields)
  }

  const handleSaveEmployee=async(draft, _employee)=>{
    let resEmployee = {}
    if(!_employee.id){
      resEmployee = await apiCreateEmployee(draft);
    }else if(isChangedObject( draft,_employee)){
      resEmployee = await apiUpdateEmployeeById(_employee.id, draft);
    }
    if(resEmployee&& !resEmployee.error){
      if(_employee.id){
        dispatch(updateEmployee(resEmployee.data))
      }else{
        dispatch(addEmployee(resEmployee.data))
        dispatch(deleteEmployee(0))
      }
    }else{
      resEmployee.error&& setError(resEmployee.error)
    }
  }

  const handleDeleteEmployee =async(id)=>{
    if(id===0){
      dispatch(deleteEmployee(id))
    }else{
      const resEmployee = await apiDeleteEmployeeById(id)
      if(resEmployee&&!resEmployee.error){
        dispatch(deleteEmployee(id))
      }
    }
  }

  const handleRestoreEmployee =async(id)=>{
    const resEmployee = await apiRestoreEmployeeById(id)
    if(resEmployee&&!resEmployee.error){
      dispatch(updateEmployee(resEmployee.data))
    }
  }

  const handlePermanentDeleteEmployee =async(id)=>{
    const resEmployee = await apiPermanentDeleteEmployeeById(id)
    if(resEmployee&&!resEmployee.error){
      dispatch(deleteEmployee(resEmployee.data))
    }
  }

  const handleChangeTable=(_pagination, _filters, _sorters)=>{
    setPagination(getPaginationQuery(_pagination))
    setSorters(getSortQuery(_sorters))
    setFilters(getFilterQuery(_filters))
  }

  const getEmployees=async()=>{
    const query = {
      ...filters&&filters,
      ...sorters&&sorters,
      ...pagination&&pagination,
    }

    const resEmployees = await apiGetEmployees(query)
    if(resEmployees && !resEmployees.error){
      dispatch(setEmployees(resEmployees.data))
      setPagination(resEmployees.meta)
    }else{
      dispatch(setEmployees([]))
    }
  }

  const getDepartments=async()=>{
    const resDepartments = await apiGetDepartments();
    if(resDepartments && !resDepartments.error){
      dispatch(setDepartments(resDepartments.data))
    }
  }

  useEffect(()=>{
    getEmployees()
  },[pagination.page_size, pagination.current, filters, sorters])

  useEffect(()=>{
    getDepartments()
  },[])

  useEffect(()=>{
    setColumns(defaultColumns.filter(column=>selectedFields.includes(column.key)))
  },[selectedFields])

  return (
    <Fragment>
      <PageHeader
        title={lang.employee}
        extra={[
          <Select mode='tags' maxTagCount={4} value={selectedFields} style={{minWidth:100}} onChange={handleSelectFields} >
            {getFieldsOptions( EMPLOYEE_FIELD_NAMES).map(field=>(
              <Select.Option  key={field.id} value={field.id}>{field.title}</Select.Option>
            ))}
          </Select>
        ]}
      />
      <EditableRowTable
        dataSource={employee.employees}
        selectedData={employee.employee}
        onSave={handleSaveEmployee}
        size='small'
        columns={columns}
        onCreate={()=>dispatch(addEmployee())}
        onDelete={handleDeleteEmployee}
        onRestore={handleRestoreEmployee}
        onPermanentDelete={handlePermanentDeleteEmployee}
        addButtonLabel={lang.createNewEmployee}
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

EmployeeListPage.propTypes = {
  employee: PropTypes.object.isRequired,
  department: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  employee: typeof state.get('employee').toJS === 'function' ? state.get('employee').toJS() : state.get('employee'),
  department: typeof state.get('department').toJS === 'function' ? state.get('department').toJS() : state.get('department'),
  auth: typeof state.get('auth').toJS === 'function' ? state.get('auth').toJS() : state.get('auth'),
});

export default connect (mapStateToProps)(EmployeeListPage)
