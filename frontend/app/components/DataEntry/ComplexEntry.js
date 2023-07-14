import React, { Fragment } from 'react';
import { Button, Checkbox, Input, InputNumber , Select, DatePicker, Slider, Radio, TimePicker } from 'antd'
import PropTypes from 'prop-types';
import { CloseCircleOutlined, SearchOutlined } from '@ant-design/icons';
import {get, isArray} from 'lodash'
import { isEmptyArray, isSameArraies } from 'utils/dataFunc';
import { convertDateObjToRange, DATE_FORMAT_1, getTodayDateTime, TIME_FORMAT_1 } from 'utils/dateTimeFun';

const ComplexEntry=({
  type, checkLabel, placeholder, onReset, clearable,
  options, optionLabelKey, optionValueKey,
  onChange, onClear, onSubmit, ...props
})=>{
  const allChecks = isArray(options) && options.map(option=>option[optionValueKey]);
  const booleanOptions = [{label:'True', value:true}, {label:'False', value:false}];

  const handleChangeValueRange=(value, name)=>{
    onChange({[name]: value})
  }

  const handleChangeDateRange=(_, values)=>{
    if(isEmptyArray(values)){
      onClear();
      onChange()
    }else{
      onChange({'from':getTodayDateTime(values[0]), 'to':getTodayDateTime(values[1])})
      onSubmit()
    }
  }

  const handleChangeCheckGroup = (values)=>{
    onChange(values)
    onSubmit()
  }

  const handleChangeCheckAll = (e)=>{
    if(e.target.checked){
      onChange(allChecks)
      onSubmit()
    }else{
      onChange([]);
      onClear()
    }
  }

  switch (type) {
    case 'select':
      return (
        <Select
          placeholder={placeholder}
          {...props}
          mode='multiple'
          onChange={(value)=>{
            onChange(value)
            isEmptyArray(value) && onClear()
          }}
          onSelect={onSubmit}
          style={{
            width: '100%',
          }}
        >
          <Select.Option value="">ALL</Select.Option>
          {Array.isArray(options)&&options.map(option=>
            <Select.Option value={option[optionValueKey]}>{option[optionLabelKey]}</Select.Option>
          )}
        </Select>
      )
    case 'checkGroup'  :
      return (
        <Fragment>
          <Checkbox 
            indeterminate={!isEmptyArray(props.value) && !isSameArraies(props.value,allChecks)}
            checked={isSameArraies(props.value, allChecks)}
            onChange={handleChangeCheckAll}
          >
            ALL
          </Checkbox>
          <br />
          {Array.isArray(options)&&(
            <Checkbox.Group {...props} onChange={handleChangeCheckGroup} >
              {options.map(option=>(
                <Fragment>
                  <Checkbox key={option[optionValueKey]} value={option[optionValueKey]}>{option[optionLabelKey]}</Checkbox>
                  <br />
                </Fragment>
              ))}
            </Checkbox.Group>
          )}
        </Fragment> 
      )
    case 'dateRange':
      return (
        <DatePicker.RangePicker 
          allowClear
          allowEmpty={[true, true]}
          value={convertDateObjToRange(props.value)}
          onChange={handleChangeDateRange}
          onOk={onSubmit}
          format={DATE_FORMAT_1}
        />
      )
    case 'timeRange':
      return (
        <TimePicker.RangePicker  
          allowClear
          allowEmpty={[true, true]}
          value={convertDateObjToRange(props.value, TIME_FORMAT_1)}
          onChange={handleChangeDateRange}
          onOk={onSubmit}
          format={TIME_FORMAT_1}
        />
      )
    case 'booleanCheckGroup'  :
      return (
        <Fragment>
          <Checkbox 
            indeterminate={!isEmptyArray(props.value) && !isSameArraies(props.value,[true, false])}
            checked={isSameArraies(props.value, [true, false])}
            onChange={handleChangeCheckAll}
          >
            ALL
          </Checkbox>
          <br />
          {Array.isArray(booleanOptions)&&(
            <Checkbox.Group {...props} onChange={handleChangeCheckGroup} >
              {booleanOptions.map(option=>(
                <Fragment>
                  <Checkbox key={option.value} value={option.value}>{option.label}</Checkbox>
                  <br />
                </Fragment>
              ))}
            </Checkbox.Group>
          )}
        </Fragment> 
      )  
    case 'slider':
      return  <Slider range /> 
    case 'radioGroup':
      return   (
        <Radio.Group {...props} onChange={e=>{onChange(e.target.value); onSubmit()}} >
          {Array.isArray(options)&&options.map(option=>
            <Radio value={option[optionValueKey]}>{option[optionLabelKey]}</Radio>
          )}
        </Radio.Group>
      )
    case 'numberRange':
      return (
        <Input.Group compact >
          <InputNumber
            {...props}
            placeholder='From'
            style={{width:'100%'}}
            value={get(props, 'value.0.from')}
            name='from'
            onChange={(value)=>handleChangeValueRange(value, 'from')}
            onPressEnter={onSubmit}
          />
          <InputNumber
            {...props}
            placeholder='To'
            value={get(props, 'value.0.to')}
            name='to'
            onChange={(value)=>handleChangeValueRange(value, 'to')}
            style={{width:'100%'}}
            onPressEnter={onSubmit}
          />
          <Button type='text' onClick={()=>onSubmit()} icon={<SearchOutlined />} />
          {clearable &&(
            <Button type='text' onClick={()=>onClear()} icon={<CloseCircleOutlined />} />
          )}
        </Input.Group>
      )
    default:
      return (
        <Input.Search
          allowClear 
          {...props}
          onChange={(e)=>{
            onChange(e.target.value)
            !e.target.value && onClear()
          }}
          placeholder={placeholder}
          onSearch={onSubmit}
          onPressEnter={onSubmit}
        />
      )
  }
}

ComplexEntry.propTypes = {
  checkLabel: PropTypes.string,
  placeholder: PropTypes.string,
  onReset: PropTypes.func,
  onChange: PropTypes.func,
  onSubmit: PropTypes.func,
  onClear: PropTypes.func,
  clearable: PropTypes.bool,
  value: PropTypes.oneOfType(PropTypes.string, PropTypes.number, PropTypes.array, PropTypes.object),
  name: PropTypes.string,
  type: PropTypes.string,
  optionValueKey: PropTypes.string,
  optionLabelKey: PropTypes.string,
  options: PropTypes.array,
};

ComplexEntry.defaultProps={
  type:undefined,
  checkLabel:undefined,
  value:undefined,
  placeholder:undefined,
  onReset:undefined,
  onSubmit:undefined,
  onChange:undefined,
  onClear:undefined,
  clearable:false,
  name:undefined,
  options:undefined,
  optionValueKey:'id',
  optionLabelKey:'name',
}

export default ComplexEntry
