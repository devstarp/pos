import React from 'react';
import PropTypes from 'prop-types';
import { Table } from 'antd';
import EditableCell from './EditableCell';

const EditableTable = ({ columns, ...props}) => {
  const editableColumns = columns.map((col) => {
    const {editable, ...column}=col;
    if (!editable) {
      return column;
    }

    return {
      ...column,
      onCell: (record, index) => ({
        record,
        index,
        name: column.key,
        ...column,
        editing: true,
      }),
    };
  });

  return (
    <Table
      components={{ body: { cell: EditableCell}}}
      bordered
      rowKey={(_,index)=> index}
      columns={editableColumns}
      {...props}
    />
  );
};

EditableTable.propTypes = {
  columns: PropTypes.array,
};

EditableTable.defaultProps={
  columns:[]
}


export default EditableTable;