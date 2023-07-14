import React from 'react';
import PropTypes from 'prop-types';
import ComplexFormItem from 'components/Forms/ComplexFormItem';

const EditableCell = ({
  name,  index,  editing,  dataIndex,  title,  inputType,  record,  
  children,  options,  rules,  optionValueKey, optionLabelKey,...props
}) => (
  <td key={name} {...props}>
    {editing ? (
      <ComplexFormItem
        name={index>=0?[index,name]:name}
        inputType={inputType}
        rules={rules}
        options={options}
        optionLabelKey={optionLabelKey}
        optionValueKey={optionValueKey}
        style={{marginBottom:0}}
      />
    ) : (
      children
    )}
  </td>
);

EditableCell.propTypes = {
  name: PropTypes.string,
  dataIndex: PropTypes.string,
  index: PropTypes.number,
  editing: PropTypes.bool,
  title: PropTypes.string,
  inputType: PropTypes.string,
  record: PropTypes.object,
  children: PropTypes.node,
  options: PropTypes.array,
  rules: PropTypes.array,
};

EditableCell.defaultProps={
  name: undefined,
  index: undefined,
  dataIndex: undefined,
  title: undefined,
  inputType: undefined,
  record: undefined,
  children: undefined,
  options: undefined,
  rules: undefined,
  editing: false,
}

export default EditableCell
