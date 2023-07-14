import React, { Fragment, useEffect, useState } from 'react';
import { PageHeader, Select } from "antd";
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { setCategories, addCategory, deleteCategory, updateCategory } from 'redux/slices/category'
import {lang} from 'services/config'
import {apiGetCategories, apiCreateCategory, apiUpdateCategoryById, apiDeleteCategoryById, apiRestoreCategoryById, apiPermanentDeleteCategoryById} from 'api/category'
import { formatDate } from 'utils/dateTimeFun';
import EditableRowTable from 'components/Table/EditableRowTable';
import { getQuery } from 'utils/productFunc';
import { requiredRule } from 'utils/validationFunc';
import { getFullName, makeJSVariableName , isChangedObject} from 'utils/dataFunc';
import BooleanIcon from 'components/Icon/BooleanIcon';
import { getFilterQuery, getPaginationQuery, getSortQuery } from 'utils/appFunc';
import { CATEGORY_FIELD_NAMES, DEFAULT_PAGINATION } from 'config/contstants';

const CategoryPage =({dispatch, category, auth})=>{
  const defaultColumns = [
    {
      key: 'name',
      editable:true,
      customFilter:true,
      multiSorter:true,
      rules:[requiredRule]
    },
    {
      key: 'description',
      editable:true,
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
      key: 'author',
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
  const [selectedFields, setSelectedFields]=useState(CATEGORY_FIELD_NAMES)
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


  const handleSave=async(draft, _category)=>{
    let resCategory = {}
    if(!_category.id){
      resCategory = await apiCreateCategory(draft);
    }else if(isChangedObject( draft,_category)){
      resCategory = await apiUpdateCategoryById(_category.id, draft);
    }
    if(resCategory&& !resCategory.error){
      if(_category.id){
        dispatch(updateCategory(resCategory.data))
      }else{
        dispatch(addCategory(resCategory.data))
        dispatch(deleteCategory(0))
      }
    }else{
      resCategory.error&& setError(resCategory.error)
    }
    
  }

  const handleDelete =async(id)=>{
    if(id===0){
      dispatch(deleteCategory(id))
    }else{
      const resCategory = await apiDeleteCategoryById(id)
      if(resCategory&&!resCategory.error){
        dispatch(deleteCategory(resCategory.data))
      }
    }
  }

  const handleRestore =async(id)=>{
    const resCategory = await apiRestoreCategoryById(id)
    if(resCategory&&!resCategory.error){
      dispatch(updateCategory(resCategory.data))
    }
  }

  const handlePermanentDelete =async(id)=>{
    const resCategory = await apiPermanentDeleteCategoryById(id)
    if(resCategory&&!resCategory.error){
      dispatch(deleteCategory(resCategory.data))
    }
  }

  const getCategories=async (filter)=>{
    const resCategories = await apiGetCategories(getQuery(filter));
    if(resCategories&& !resCategories.error){
      dispatch(setCategories(resCategories.data))
    }
  }

  useEffect(()=>{
    getCategories()
  },[pagination.page_size, pagination.current, filters, sorters])

  useEffect(()=>{
    setColumns(defaultColumns.filter(column=>selectedFields.includes(column.key)))
  },[selectedFields])
  
  return (
    <Fragment>
      <PageHeader
        title={lang.categories}
        extra={[
          <Select mode='tags' maxTagCount={4} value={selectedFields} style={{minWidth:100}} onChange={handleSelectFields} >
            {CATEGORY_FIELD_NAMES.map(fieldName=>(
              <Select.Option  key={fieldName} value={fieldName}>{lang[makeJSVariableName(fieldName)]}</Select.Option>
            ))}
          </Select>
        ]}
      />
      <EditableRowTable
        addButtonLabel={lang.createNewCategory}
        dataSource={category.categories}
        onCreate={()=>dispatch(addCategory())}
        onSave={handleSave}
        onDelete={handleDelete}
        onRestore={handleRestore}
        onPermanentDelete={handlePermanentDelete}
        employeeID={auth.employee.id}
        editable={auth.employee.position==='MANAGER'}
        columns={columns}
        error={error}
        selectedData={category.category}
        onChange={handleChangeTable}
        pagination={{
          showSizeChanger: true, 
          pageSizeOptions: ["6","8","10","15","20"], 
          total:pagination.total,
          pageSize: pagination.page_size
        }}
      />
    </Fragment>
  );
}

CategoryPage.propTypes = {
  category: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  category: typeof state.get('category').toJS === 'function' ? state.get('category').toJS() : state.get('category'),
  auth: typeof state.get('auth').toJS === 'function' ? state.get('auth').toJS() : state.get('auth'),
});

export default connect(mapStateToProps)(CategoryPage)
