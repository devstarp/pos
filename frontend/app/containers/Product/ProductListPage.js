import React, { Fragment, useEffect, useState } from 'react';
import { Button, PageHeader, Select, Tooltip } from 'antd'
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {lang} from 'services/config'
import { apiCreateProduct, apiDeleteProductById, apiGetProducts, apiUpdateProductsByIds,
  apiUpdateProductById, apiRestoreProductById, apiPermanentDeleteProductById } from 'api/product';
import { addProduct, deleteProduct, setProducts, updateProduct, updateProducts } from 'redux/slices/product';
import { formatDate } from 'utils/dateTimeFun';
import { apiGetCategories } from 'api/category';
import { setCategories } from 'redux/slices/category';
import EditableRowTable from 'components/Table/EditableRowTable';
import BooleanIcon from 'components/Icon/BooleanIcon'
import { isChangedObject, makeJSVariableName, getFullName } from 'utils/dataFunc';
import { getFieldsOptions, getFilterQuery, getPaginationQuery, getQuery, getSortQuery } from 'utils/appFunc';
import { numberRule, requiredRule } from 'utils/validationFunc';
import { CURRENCIES, DEFAULT_PAGINATION, PRODUCT_FIELD_NAMES } from 'config/contstants';
import QRCode from "react-qr-code";
import Barcode from 'react-barcode'

const ProductListPage=({dispatch, category,  product, auth})=>{
  const defaultColumns = [
    {
      key: 'product_code',
      type:'code',
      editable:true,
      customFilter:true,
      multiSorter:true,
      ellipsis: true,
    },
    {
      key: 'barcode',
      type:'code',
      inputType: 'number',
      customFilter:true,
      multiSorter:true,
      // fixed:'left',
      editable:true,
      rules:[numberRule],
      width: 160,
      ellipsis: true,
      align:'center',
      render: (value)=> value && <Barcode value={value} height={15} width={1} fontSize={12} />,

    },
    {
      key: 'qrcode',
      type:'code',
      editable:true,
      customFilter:true,
      align:'center',
      render: (value)=> value && <QRCode value={value} size={30} />
    },
    {
      key: 'category_id',
      type:'name',
      dataIndex:  ['category', 'name'],
      editable:true,
      inputType:'select',
      filterType:'checkGroup',
      options:category.categories,
      customFilter:true,
      multiSorter:true,
    },
    {
      key: 'brand',
      type:'name',
      editable:true,
      customFilter:true,
      fixed:'center',
      multiSorter:true,
    },
    {
      key: 'name',
      type:'name',
      editable:true,
      customFilter:true,
      multiSorter:true,
      fixed:'center',
      rules:[requiredRule]
    },
    {
      editable:true,
      multiSorter:true,
      customFilter:true,
      type:'name',
      key: 'description',
    },
    {
      title: lang.totalQuantity,
      dataIndex: 'total_quantity',
      inputType:'number',
      filterType:'numberRange',
      editable:true,
      customFilter:true,
      multiSorter:true,
      key: 'total_quantity',
    },
    {
      key: 'purchase_price',
      type:'purchase',
      title: lang.price,
      inputType:'number',
      editable:true,
      filterType:'numberRange',
      customFilter:true,
      multiSorter:true,
      width: 100,
    },
    {
      key: 'purchase_currency',
      type:'purchase',
      title: lang.currencyType,
      editable:true,
      inputType:'select',
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
      editable:true,
      inputType:'number',
      filterType:'numberRange',
      customFilter:true,
      multiSorter:true,
      width: 100,
    },
    {
      key: 'sale_currency',
      type:'sale',
      title: lang.currencyType,
      editable:true,
      inputType:'select',
      options:CURRENCIES,
      filterType:'checkGroup',
      customFilter:true,
      multiSorter:true,
      width: 100,
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
  const [selectedFields, setSelectedFields]=useState(PRODUCT_FIELD_NAMES)
  const [pagination, setPagination]=useState(DEFAULT_PAGINATION);
  const [filters, setFilters]=useState()
  const [sorters, setSorters]=useState()
  const [selectedProducts, setSelectedProducts]=useState([])

  const handleSelectFields=(_fields)=>{
    setSelectedFields(_fields)
  }

  const handleSaveProduct=async(draft, _product)=>{
    let resProduct = {}
    if(!_product.id){
      resProduct = await apiCreateProduct(draft);
    }else if(isChangedObject( draft,_product)){
      resProduct = await apiUpdateProductById(_product.id, draft);
    }
    if(resProduct&& !resProduct.error){
      if(_product.id){
        dispatch(updateProduct(resProduct.data))
      }else{
        dispatch(addProduct(resProduct.data))
        dispatch(deleteProduct(0))
      }
    }else{
      resProduct.error&& setError(resProduct.error)
    }
  }

  const handleDeleteProduct =async(id)=>{
    if(id===0){
      dispatch(deleteProduct(id))
    }else{
      const resProduct = await apiDeleteProductById(id)
      if(resProduct&&!resProduct.error){
        dispatch(deleteProduct(id))
      }
    }
  }

  const handleRestoreProduct =async(id)=>{
    const resProduct = await apiRestoreProductById(id)
    if(resProduct&&!resProduct.error){
      dispatch(updateProduct(resProduct.data))
    }
  }

  const handlePermanentDeleteProduct =async(id)=>{
    const resProduct = await apiPermanentDeleteProductById(id)
    if(resProduct&&!resProduct.error){
      dispatch(deleteProduct(resProduct.data))
    }
  }

  const handleFixProducts =async()=>{
    const ids=selectedProducts.map(_product=>_product.id).join(',')
    const resProducts = await apiUpdateProductsByIds(ids, {editable:false})
    if(resProducts&&!resProducts.error){
      dispatch(updateProducts(resProducts.data))
    }
  }

  const handleSelectProduct= (_product, selected) => {
    if(selected){
      setSelectedProducts([...selectedProducts,_product])
    }else{
      setSelectedProducts(selectedProducts.filter(ele=>ele.id!==_product.id))
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

  return (
    <Fragment>
      <PageHeader
        title={lang.product}
        extra={[
          <Select mode='tags' maxTagCount={4} value={selectedFields} style={{minWidth:100}} onChange={handleSelectFields} >
            {getFieldsOptions( PRODUCT_FIELD_NAMES).map(field=>(
              <Select.Option  key={field.id} value={field.id}>{field.title}</Select.Option>
            ))}
          </Select>
        ]}
      />
      <EditableRowTable
        dataSource={product.products}
        selectedData={product.product}
        onSave={handleSaveProduct}
        size='small'
        columns={columns}
        onCreate={()=>dispatch(addProduct())}
        onDelete={handleDeleteProduct}
        onRestore={handleRestoreProduct}
        onPermanentDelete={handlePermanentDeleteProduct}
        addButtonLabel={lang.createNewProduct}
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
        rowSelection={{
          selectedRowKeys:selectedProducts.map(_product=>_product.id),
          onSelect:handleSelectProduct,
        }}
        ActionButtons={[
          <Button disabled={selectedProducts.length===0}  onClick={() => handleFixProducts()} >Not Edit</Button>
        ]}
      />
    </Fragment>
  )
}

ProductListPage.propTypes = {
  product: PropTypes.object.isRequired,
  category: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  product: typeof state.get('product').toJS === 'function' ? state.get('product').toJS() : state.get('product'),
  category: typeof state.get('category').toJS === 'function' ? state.get('category').toJS() : state.get('category'),
  auth: typeof state.get('auth').toJS === 'function' ? state.get('auth').toJS() : state.get('auth'),
});

export default connect (mapStateToProps)(ProductListPage)
