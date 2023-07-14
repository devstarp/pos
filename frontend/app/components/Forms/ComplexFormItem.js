import React from 'react';
import { Checkbox, Form, Input, InputNumber , Select, DatePicker, Slider, TimePicker } from 'antd'
import PropTypes from 'prop-types';
import { DATE_FORMAT_1, TIME_FORMAT_1 } from 'utils/dateTimeFun';
import { isArray } from 'lodash';

const ComplexFormItem=({
  inputType, checkLabel, placeholder, onReset, deletable,
  name,options, optionLabelKey, optionValueKey, ...props
})=>{
  const renderInput=(param)=>{
    switch (param) {
      case 'select':
        return (
          <Select placeholder={placeholder}>
            {isArray(options)&&options.map(option=>
              <Select.Option value={option[optionValueKey]}>{option[optionLabelKey]}</Select.Option>
            )}
          </Select>
        )
      case 'date':
        return <DatePicker allowEmpty  format={DATE_FORMAT_1} />
      case 'dateRange':
        return <DatePicker.RangePicker  allowEmpty={[true, true]} format={DATE_FORMAT_1} />
      case 'timeRange':
        return <TimePicker.RangePicker  allowEmpty={[true, true]} format={TIME_FORMAT_1} />
      case 'check':
        return  <Checkbox>{checkLabel}</Checkbox> 
      case 'slider':
        return  <Slider range /> 
      case 'number':
        return <InputNumber />
      default:
        return <Input allowClear placeholder={placeholder} />
    }
  }
  return (
    <Form.Item name={name} valuePropName={inputType==='check'?'checked':'value'} {...props}>
      {renderInput(inputType)}
    </Form.Item>
  )
}
ComplexFormItem.propTypes = {
  inputType: PropTypes.string,
  checkLabel: PropTypes.string,
  placeholder: PropTypes.string,
  onReset: PropTypes.func,
  deletable: PropTypes.bool,
  name: PropTypes.string,
  optionValueKey: PropTypes.string,
  optionLabelKey: PropTypes.string,
  options: PropTypes.array,
};

ComplexFormItem.defaultProps={
  inputType:undefined,
  checkLabel:undefined,
  placeholder:undefined,
  onReset:undefined,
  deletable:false,
  name:undefined,
  options:undefined,
  optionValueKey:'id',
  optionLabelKey:'name',
}

export default ComplexFormItem
