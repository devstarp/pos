import React, { Fragment } from 'react';
import { Button, Form, Radio, Col, Row } from 'antd'
import PropTypes from 'prop-types';
import { isArray, isNumber } from 'lodash';
import ComplexFormItem from './ComplexFormItem';

const SearchForm=({fields, onSearch ,...props})=>{
  const [search] =Form.useForm()

  const handleReset = ()=>{
    search.resetFields();
    onSearch(search.getFieldsValue())
  }

  const handleResetGroup = (field)=>{
    search.setFieldValue(field.name, []);
    onSearch(search.getFieldsValue())
  }

  const renderBreakLine = (param)=>{
    if(param){
      const lines = [<Col span={8} />]
      if(isNumber(param)){
        for (let index = 0; index < param; index+=1) {
          lines.push(<Col span={8} />)
        }
      }
      return lines
    }
  }
    
  return (
    <Form
      layout='inline'
      labelWrap
      form={search}
      onValuesChange={(_, values)=>onSearch(values)}
      size='small'
      {...props}
    >
      <Row gutter={12}>
        { isArray(fields) && fields.map(field=>(
          <Fragment>
            <Col span={8} key={field.key} >
              <ComplexFormItem
                {...field} 
                deletable={search.getFieldValue(field.name)&&search.getFieldValue(field.name).length>0} 
                onReset={()=>handleResetGroup(field)}
              />
            </Col>
            {renderBreakLine(field.breakLine)}
          </Fragment>
        ))}
        <Col span={8}>
          <Form.Item label="Operation" name="operation">
            <Radio.Group >
              <Radio value="AND">AND</Radio>
              <Radio value="OR">OR</Radio>
            </Radio.Group>
          </Form.Item>
        </Col>
        <Col span={24}>
          <Button onClick={handleReset}>Reset</Button>
        </Col>
      </Row>    
    </Form>
  )
}
SearchForm.propTypes = {
  fields: PropTypes.array,
  onSearch: PropTypes.func.isRequired,
};

SearchForm.defaultProps={
  fields:[]
}

export default SearchForm
