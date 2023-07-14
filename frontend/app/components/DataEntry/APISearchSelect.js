import React, { Fragment, useEffect, useMemo, useState } from 'react';
import { Button, Select, Form, Divider, Space, Input, Spin } from 'antd'
import PropTypes from 'prop-types';
import { PlusOutlined} from '@ant-design/icons'
import { debounce } from 'lodash';

const APISearchSelect =({apiCreateOption, debounceTimeout, apiGetOptions, createFieldName, ...props})=>{ 
  const [createForm]=Form.useForm()
  const [loading, setLoading]=useState(false)
  const [options, setOptions]=useState([]);
  const [searchKey, setSearchKey]=useState();

  const getOptions = async () => {
    setOptions([]);
    setLoading(true);
    const searchParams={}
    if(searchKey){
      searchParams.search_key= searchKey
    }
    const resOptions = await apiGetOptions(searchParams)
    setLoading(false);
    if(resOptions && !resOptions.error && resOptions.data && resOptions.data.length>0){
      setOptions(resOptions.data)
    }else{
      createForm.setFieldValue(createFieldName, searchKey)
    }
  };

  const handleLoadOptions = (value) => {
    setSearchKey(value)
  };

  const handleDebounceFetch = useMemo(() => debounce(handleLoadOptions, debounceTimeout), [apiGetOptions, debounceTimeout]);
  
  const handleCreateNew=async(draft)=>{
    const  resOption= await apiCreateOption(draft)
    
    if(resOption&&!resOption.error){
      setOptions([resOption.data])
    }
    
  }

  useEffect(()=>{
    getOptions()
  },[searchKey])

  return (
    <Select
      showSearch
      filterOption={false}
      onSearch={handleDebounceFetch}
      notFoundContent={(loading?
        <Spin size="small" />:
        <Fragment>
          <Form form={createForm} onFinish={handleCreateNew}>
            <Space
              style={{
                padding: '0 8px 4px',
              }}
            >
              <Form.Item name={createFieldName} style={{marginBottom:0}} >
                <Input placeholder="Please enter name" />
              </Form.Item>
              <Button type="text" size='small' htmlType='submit' icon={<PlusOutlined />}  />
            </Space>
          </Form>
          <Divider />
        </Fragment>
      )}
      options={options}
      {...props}
    />
  );
}

APISearchSelect.propTypes = {
  apiCreateOption: PropTypes.func,
  apiGetOptions: PropTypes.func,
  debounceTimeout: PropTypes.number,
  createFieldName: PropTypes.string,
};
APISearchSelect.defaultProps={
  apiCreateOption: async()=>{},
  apiGetOptions: async()=>{},
  createFieldName: 'name',
  debounceTimeout: 100,
}

export default APISearchSelect