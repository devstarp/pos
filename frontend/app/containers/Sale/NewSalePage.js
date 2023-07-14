import React, { Fragment, useEffect, useState } from 'react';
import { lang } from 'services/config'
import { Button, Row, Col, Select, Form, Popconfirm, Statistic, InputNumber, Divider, Space, Input, Modal } from 'antd'
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { setProducts } from 'redux/slices/product'
import {DeleteOutlined, EyeOutlined} from '@ant-design/icons'
import { apiGetProducts } from 'api/product';
import { findIndex, get, filter } from 'lodash-es';
import EditableTable from 'components/Table/EditableTable';
import { setCategories } from 'redux/slices/category';
import { apiGetCategories } from 'api/category';
import { CURRENCIES, DEFAULT_PAGINATION, PRODUCT_FIELD_NAMES } from 'config/contstants';
import { formatDate } from 'utils/dateTimeFun';
import BooleanIcon from 'components/Icon/BooleanIcon';
import { getFullName, makeJSVariableName } from 'utils/dataFunc';
import QRCode from 'react-qr-code';
import EditableRowTable from 'components/Table/EditableRowTable';
import { getFilterQuery, getPaginationQuery, getSortQuery } from 'utils/appFunc';
import CurrencyRateTable from 'components/Table/CurrencyRateTable';
import { getCurrencyRate } from 'utils/currencyFunc';
import { requiredRule } from 'utils/validationFunc';
import APISearchSelect from 'components/DataEntry/APISearchSelect';
import { apiCreateCustomer, apiGetCustomers } from 'api/customer';
import { apiCreateSaleWithItems } from 'api/sale';

const NATIONAL_CURRENCY='WON'

const CURRENCY_RATES=[
  {id: 2, name:'USD', label:'US$', purchase_price:7200, sale_price:7400},
  {id: 3, name:'RMB', label:'RMB.¥', purchase_price:950, sale_price:1092},
]

const NewSalePage =({dispatch, product, supplier, category, history})=>{ 
  const defaultColumns = [
    {
      key: 'barcode',
      type:'code',
      inputType: 'number',
      customFilter:true,
      multiSorter:true,
    },
    {
      key: 'qrcode',
      type:'code',
      customFilter:true,
      align:'center',
      render: (value)=> value && <QRCode value={value} size={30} />
    },
    {
      key: 'product_code',
      type:'code',
      customFilter:true,
      multiSorter:true,
      ellipsis: true,
    },
    {
      key: 'category_id',
      type:'name',
      dataIndex:  ['category', 'name'],
      filterType:'checkGroup',
      options:category.categories,
      width: 115,
      ellipsis: true,
      customFilter:true,
      multiSorter:true,
    },
    {
      key: 'brand',
      type:'name',
      customFilter:true,
      multiSorter:true,
    },
    {
      key: 'name',
      type:'name',
      customFilter:true,
      multiSorter:true,
    },
    {
      multiSorter:true,
      customFilter:true,
      type:'name',
      key: 'description',
    },
    {
      title: lang.totalQuantity,
      dataIndex: 'total_quantity',
      filterType:'numberRange',
      customFilter:true,
      multiSorter:true,
      width: 100,
      key: 'total_quantity',
    },
    {
      key: 'purchase_price',
      type:'purchase',
      title: lang.price,
      filterType:'numberRange',
      customFilter:true,
      multiSorter:true,
      width: 100,
    },
    {
      key: 'purchase_currency',
      type:'purchase',
      title: lang.currencyType,
      filterType:'checkGroup',
      customFilter:true,
      options:CURRENCIES,
      multiSorter:true,
      width: 100,
    },
    {
      key: 'sale_price',
      type:'sale',
      title: lang.price,
      filterType:'numberRange',
      customFilter:true,
      multiSorter:true,
      width: 100,
    },
    {
      key: 'sale_currency',
      type:'sale',
      title: lang.currencyType,
      options:CURRENCIES,
      filterType:'checkGroup',
      customFilter:true,
      multiSorter:true,
      width: 100,
    },
    {
      key: 'new',
      type:'status',
      align:'center',
      ellipsis: true,
      width: 100,
      render: value=> <BooleanIcon value={value} />
    },
    {
      key: 'editable',
      type:'status',
      align:'center',
      width: 100,
      ellipsis: true,
      render: value=> <BooleanIcon value={value} />
    },
    {
      key: 'enabled',
      type:'status',
      align:'center',
      width: 100,
      ellipsis: true,
      render: value=> <BooleanIcon value={value} />
    },
    {
      key: 'user_id',
      title: lang.author,
      dataIndex: 'user',
      multiSorter:true,
      ellipsis: true,
      render: value=> getFullName(value)
    },
    {
      key: 'created_at',
      type:'date',
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
  const [form ]=Form.useForm()
  const items=filter(Form.useWatch('items',form), item=>!!item.product_id)
  const selectedCurrency=Form.useWatch('currency',form)
  const [crVisible, setCRVisible]=useState(false)
  const [subTotal, setSubTotal]=useState(0)
  const [columns, setColumns]=useState(defaultColumns)
  const [selectedFields, setSelectedFields]=useState(['barcode', 'name', 'category_id', 'sale_price', 'sale_currency', 'total_quantity'])
  const [pagination, setPagination]=useState(DEFAULT_PAGINATION);
  const [filters, setFilters]=useState()
  const [sorters, setSorters]=useState()
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  let handleAddItem ;
  let handleRemoveItem ;

  const handleSelectFields=(_fields)=>{
    setSelectedFields(_fields)
  }

  const handleSelectProduct= (_product, selected) => {
    if(selected){
      const tmpProduct = { 
        currency:_product.sale_currency, 
        quantity:1, 
        price:Number(_product.sale_price), 
        product_id:_product.id, 
        name:_product.name 
      }
      const index= findIndex(items, item=>item.product_id===_product.id)
      index<0 && handleAddItem(tmpProduct)
            
    }else{
      const index= findIndex(items, item=>item.product_id===_product.id)
      handleRemoveItem(index)
    }
            
  }

  const handleCreateSaleWithItems =async()=>{
    try {
      const draft = await form.validateFields();
      console.log('draft---', draft)
      const resSale = await apiCreateSaleWithItems(draft);
      if(resSale&&!resSale.error){
        history.push({pathname:'/success', state:{order:resSale.data, type:'SALE'}})
      }else{
        resSale.error && form .setFields(resSale.error)
      }
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  }
  
  const handleChangeTable=(_pagination, _filters, _sorters)=>{
    setPagination(getPaginationQuery(_pagination))
    setSorters(getSortQuery(_sorters))
    setFilters(getFilterQuery(_filters))
  }

  const getProducts=async()=>{
    const query = {
      ...filters&&filters,
      ...sorters&&sorters,
      ...pagination&&pagination,
    }
    const resproducts = await apiGetProducts(query)
    if(resproducts && !resproducts.error){
      dispatch(setProducts(resproducts.data))
      setPagination(resproducts.meta)
    }else{
      dispatch(setProducts([]))
      setPagination(DEFAULT_PAGINATION)
    }
  }

  const getCategories=async()=>{
    const resCategories = await apiGetCategories();
    if(resCategories && !resCategories.error){
      dispatch(setCategories(resCategories.data))
    }
  }

  useEffect(()=>{
    getProducts()
  },[pagination.page_size, pagination.current, filters, sorters])

  useEffect(()=>{
    getCategories()
  },[])

  useEffect(()=>{
    setColumns(defaultColumns.filter(column=>selectedFields.includes(column.key)))
  },[selectedFields])

  const fieldSelects= PRODUCT_FIELD_NAMES.map(fieldName=>({id:fieldName, title: lang[makeJSVariableName(fieldName)]}))

  useEffect(()=>{
    let total=0;
    for (let index = 0; index < items.length; index+=1) {
      const productItem = items[index];
      const currencyRate=getCurrencyRate(productItem.currency, selectedCurrency, NATIONAL_CURRENCY, CURRENCY_RATES);
      form.setFieldValue(['items', index, 'paid_currency'],selectedCurrency)
      form.setFieldValue(['items', index, 'currency_rate'],currencyRate)
      total += Number(productItem.price)*Number(productItem.quantity) * currencyRate
    }
    form.setFieldValue('total_amount', total)
    setSubTotal(total)
  },[items, selectedCurrency])

  const itemsColumns = [
    {
      title: lang.product,
      dataIndex: 'name',
      key: lang.product,
      ellipsis:true,
    },
    {
      title: lang.price,
      width: '19%',
      dataIndex: 'price',
      key: 'price',
      editable: true,
      inputType:'number',
    },
    {
      title: lang.currencyType,
      dataIndex: 'currency',
      key: 'currency',
      editable: true,
      width: '15%',
      inputType:'select',
      options: CURRENCIES,
      optionLabelKey:'label'
    },
    {
      title: lang.qty,
      width: '12%',
      key: 'quantity',
      dataIndex: 'quantity',
      editable: true,
      inputType:'number',
    },
    {
      title: lang.total,
      width: '16%',
      dataIndex: 'total',
      key: 'total',
      align:'center',
      render:(_,record)=>Number(record.price)*Number(record.quantity)
    },
    {
      title: '',
      width: '10%',
      dataIndex: 'operation',
      key: 'operation',
      render:(_,record,index)=>(
        <Button
          icon={<DeleteOutlined />}
          onClick={()=>{
            setSelectedRowKeys(selectedRowKeys.filter(rowKey=>rowKey!==record.id))
            console.log(selectedRowKeys.filter(rowKey=>rowKey!==record.id))
            handleRemoveItem(index)
          }}
        />)
    },
  ]

  return (
    <Row gutter={[5, 20]}>
      <Col xs={24} md={13}>
        <Form form={form} initialValues={{items:[], currency:'USD'}} component={false}>
          <Form.Item name='customer_id' label='Customer' rules={[{required:true, message:'Please select the supplier'}]}>
            <APISearchSelect
              defaultOptions={supplier.suppliers}
              debounceTimeout={100}
              apiGetOptions={apiGetCustomers}
              fieldNames={{label:'name', value:'id'}}
              createFieldName="name"
              apiCreateOption={apiCreateCustomer}
            />
          </Form.Item>
          <Form.List name='items' label='Items' rules={[{min:1, type:'array', message:'Please select at least 1 item'}]}>
            {(_,{add, remove}, {errors})=>{
              handleAddItem=add              
              handleRemoveItem=remove        
              return (
                <Fragment>
                  <EditableTable
                    size="small"
                    dataSource={items}
                    columns={itemsColumns}
                    // rowClassName={(record, index) => index === this.state.selectedRow ? 'sale-selected-row' : ''}
                    pagination={false}
                  />
                  <Form.ErrorList errors={errors} />
                </Fragment>
              )}}
          </Form.List>
          <Space>
            <Statistic
              title="Sub Total Amount"
              value={subTotal}
              suffix={(
                <Form.Item name='currency' rules={[requiredRule]}>
                  <Select style={{width:'100%'}}>
                    {CURRENCIES.map((_currency) => <Select.Option key={_currency.id} value={_currency.id} >{_currency.label}</Select.Option>)}
                  </Select>
                </Form.Item>
              )}
            />
            <Button icon={<EyeOutlined />} onClick={()=>setCRVisible(true)}>View currency Rate</Button>
          </Space>
          <Form.Item name='total_amount' label='Total Amount' >
            <InputNumber />
          </Form.Item>
          <Popconfirm  title="Sure to sale?" onConfirm={handleCreateSaleWithItems} >
            <Button >Sale</Button>
          </Popconfirm>
        </Form>
      </Col>
      <Col xs={24} md={11}>
        <Select mode='tags' maxTagCount={4} value={selectedFields} style={{minWidth:100}} onChange={handleSelectFields} >
          {fieldSelects.map(field=>(
            <Select.Option  key={field.id} value={field.id}>{field.title}</Select.Option>
          ))}
        </Select>
        <EditableRowTable
          noOperationColumn
          dataSource={product.products}
          selectedData={product.product}
          size='small'
          columns={columns}
          onChange={handleChangeTable}
          pagination={{
            showSizeChanger: true, 
            pageSizeOptions: ["6","8","10","15","20"], 
            total:pagination.total,
            pageSize: pagination.page_size
          }}
          rowSelection={{
            selectedRowKeys:items.map(item=>item.product_id),
            onSelect:handleSelectProduct,
            // onChange: (values)=>setSelectedRowKeys(values),
          }}
        />
        <Modal
          title="Current Currency Rates"
          visible={crVisible}
          onCancel={()=>setCRVisible(false)}
        >
          <CurrencyRateTable dataSource={CURRENCY_RATES} />
        </Modal>
      </Col>
    </Row>
  );
}

NewSalePage.propTypes = {
  product: PropTypes.object.isRequired,
  category: PropTypes.object.isRequired,
  supplier: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  product: typeof state.get('product').toJS === 'function' ? state.get('product').toJS() : state.get('product'),
  category: typeof state.get('category').toJS === 'function' ? state.get('category').toJS() : state.get('category'),
  supplier: typeof state.get('supplier').toJS === 'function' ? state.get('supplier').toJS() : state.get('supplier'),
});

export default connect(mapStateToProps)(NewSalePage)