import React, { Fragment, useEffect, useState } from 'react';
import { Table, Button, Form, Popconfirm } from "antd";
import {
  EditOutlined, CloseCircleOutlined, SaveOutlined, 
  DeleteOutlined, RedoOutlined, PlusOutlined, EyeOutlined
} from '@ant-design/icons'
import PropTypes from 'prop-types';
import { isObject, isFunction, isArray, findIndex } from 'lodash';
import ComplexEntry from 'components/DataEntry/ComplexEntry';
import {lang} from 'services/config'
import { getCommonColumn } from 'utils/appFunc';
import EditableCell from './EditableCell';

const EditableRowTable =({
  error, employeeID, editable, selectedData, 
  onCreate, columns, onSave, onViewDetail, addButtonLabel,
  onDelete, onRestore, onPermanentDelete, noOperationColumn,
  ActionButtons,
  ...props
})=>{
  const [form] = Form.useForm();
  const [editingId, setEditingId]=useState();
  const isEditing = (record)=> record&& typeof record ==='object' && record.id===editingId

  const handleSave=async(record)=>{
    try {
      const row = await form.validateFields();
      // editingId===0 && setEditingId('');
      onSave(row, record)
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  }

  const handleCreate=async()=>{
    form.resetFields();
    setEditingId(0)
    onCreate()
  }

  const handleEdit = (record) => {
    form.resetFields();
    form.setFieldsValue(record);
    setEditingId(record.id);
    editingId===0 && onDelete(0)
  };

  const handelCancel=()=>{
    setEditingId('');
    editingId===0&& onDelete(0)
  }

  const handleChange = (value, orgValue, callback) => {
    if(isArray(value)){
      return callback(value)
    }else if(isObject(value)){
      return callback([{...orgValue[0], ...value}])
    }
    return callback(value)
  };

  useEffect(()=>{
    typeof error ==='object' && form.setFields(error) 
  },[error])

  useEffect(()=>{
    selectedData && selectedData.id && setEditingId('')
  },[selectedData])

  const operationColumn =  {
    title: 'operation',
    dataIndex: 'operation',
    fixed:'right',
    align:'right',
    filterType: 'radioGroup',
    options:[{id:'AND', label:'AND'}, {id:'OR', label:'OR'}],
    optionLabelKey:'label',
    customFilter:true,
    width: 150,
    render: (_, record) => {
      if(!isObject(record)){
        return <Fragment />
      }
      const recordEditable = editable ||( record.author_id=== employeeID && record.editable)
      const recordDeletable = editable || record.author_id=== employeeID
      return isEditing(record) ? (
        <Fragment>
          <Popconfirm title="Sure to save?" onConfirm={() => handleSave(record)}>
            <Button type="primary" shape="circle" icon={<SaveOutlined />} />
          </Popconfirm>
          <Button type="primary" shape="circle" icon={<CloseCircleOutlined />} onClick={handelCancel} />
        </Fragment>
      ) : (
        <Fragment>
          {typeof onViewDetail ==='function' && 
            <Button type="primary" shape="circle" icon={<EyeOutlined />} onClick={()=>onViewDetail(record)} />
          }
          <Button
            type="primary"
            shape="circle"
            disabled={!recordEditable}
            icon={<EditOutlined />}
            onClick={()=>handleEdit(record)}
          />
          {record.deleted_at&&(
            <Popconfirm title="Sure to restore?" onConfirm={() => onRestore(record.id)}>
              <Button type="primary" danger shape="circle" icon={<RedoOutlined />} />
            </Popconfirm>
          )}
          <Popconfirm title="Sure to delete?" onConfirm={() => !record.deleted_at? onDelete(record.id):onPermanentDelete(record.id)}>
            <Button type="primary" danger shape="circle"  disabled={!recordEditable} icon={<DeleteOutlined />} />
          </Popconfirm>
        </Fragment>
      )},
  }

  const getColumnSearchProps = ({inputType,  filterType,  ...searchProps}) =>({
    filterDropdown:({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <ComplexEntry
        {...searchProps}
        type={filterType}
        value={selectedKeys}
        onChange={(value)=>handleChange(value, selectedKeys, setSelectedKeys)}
        onSubmit={() => confirm()}
        onClear={()=>{clearFilters(); confirm()}}
        clearable={!!selectedKeys}
      />
    )
  })

  const getColumnMultiSorterProps=(col, index)=>({
    sorter:{multiple: index}
  })

  const getColumnEllipsis=()=>({
    ellipsis: true,
    // render: (value) => (
    //   <Tooltip placement="topCenter" title={value}>
    //     {value}
    //   </Tooltip>
    // ),
  })

  const allColumns= !noOperationColumn ? [...columns, operationColumn]:columns
  
  const mergedColumns = allColumns.map((col, index) => {
    const {editable:_editable, customFilter, multiSorter, ellipsis, ...column}=col;
    const commonColumn={
      ...getCommonColumn(column, index),
      ...customFilter &&getColumnSearchProps(column),
      ...multiSorter && getColumnMultiSorterProps(column, index),
      ...ellipsis && getColumnEllipsis()
    }
    if (!_editable) {
      return commonColumn;
    }
    return {
      ...commonColumn,
      onCell: (record) => ({
        record,
        name: column.key,
        ...column,
        editing: isEditing(record),
      }),
    };
  });

  const getGroupColumns=(_columns)=>{
    const results=[];
    for(const column of _columns){
      if(!column.type){
        results.push(column)
      }else{
        const parentColumnIndex = findIndex(results, ele=>ele.key===column.type)
        if(parentColumnIndex>=0){
          results[parentColumnIndex].children.push(column)
        }else{
          results.push({children:[column],key:column.type, title:lang[column.type]||column.type})
        }
      }
    }
    return results
  }

  return (
    <Form form={form} component={false}>
      <Table
        bordered
        title={()=> ([
          isFunction(onCreate) && <Button icon={<PlusOutlined />} disabled={editingId===0} onClick={() => handleCreate()} >{addButtonLabel}</Button>,
          ...ActionButtons
        ])}
        columns={getGroupColumns(mergedColumns)}
        components={{
          body: { cell: EditableCell }
        }}
        rowKey={(record) => record.id}
        scroll={{
          x: mergedColumns.length * 125,
        }}
        size='small'
        {...props}
      />
    </Form>
  );
}

EditableRowTable.propTypes = {
  onSave: PropTypes.func,
  onCreate: PropTypes.func,
  onDelete: PropTypes.func,
  onRestore: PropTypes.func,
  onPermanentDelete: PropTypes.func,
  onViewDetail: PropTypes.func,
  columns: PropTypes.array.isRequired,
  addButtonLabel: PropTypes.string,
  employeeID: PropTypes.string,
  ActionButtons: PropTypes.arrayOf(PropTypes.node),
  editable: PropTypes.bool,
  noOperationColumn: PropTypes.bool,
  selectedData: PropTypes.object,
  error: PropTypes.object,
};

EditableRowTable.defaultProps={
  addButtonLabel: undefined, 
  employeeID:undefined,
  error:undefined,
  editable:false,
  noOperationColumn:false,
  onSave:undefined,
  onCreate:undefined,
  onDelete:undefined,
  onRestore:undefined,
  onPermanentDelete:undefined,
  onViewDetail:undefined,
  selectedData:{},
  ActionButtons:[]
}

export default EditableRowTable
