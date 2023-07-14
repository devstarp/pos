import React, { Component } from 'react';
import { Table, Button, Icon, Modal, Form, Input, InputNumber, Upload, Popconfirm, Dropdown, Menu, Select } from "antd";
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { setProducts, setProduct, addProduct, deleteProduct, updateProduct} from '../redux/slices/product'
import { setCategories } from '../redux/slices/category'
import moment from 'moment'
import { CustomImage } from '../assets/ProductPhotos/CustomImage'
import {lang} from '../services/config'
import {pHost} from '../services/config'
import { apiCreateProduct, apiGetProducts, apiUpdateProductById } from '../api/product';
import { formatDate } from '../utils/dateTimeFun';
import { apiGetCategories } from '../api/category';

type Props = {};
const Search = Input.Search;
const FormItem = Form.Item;

const MenuItem = Menu.Item;

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

export default class CreateProductModal extends Component<Props> {
    props: Props
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            type: 'edit',
            selected: {},
            name: '',
            detailModal: false,
            // continue: false,
            // barkod: '',
            // editVisible:false,
        }
    }
    
    handleOk = () => {
        this.props.form.validateFieldsAndScroll(async(err, values) => {
            if (!err) {
                const dataToSend = {
                    ...values,
                    // barcode: values.barcode,
                    // name: values.name,
                    // description: values.description,
                    // category: values.category ? values.category : 'Diger',
                    // purchasePrice: values.purchasePrice,
                    // salePrice: values.salePrice,
                    // imagePath: this.state.imageUrl,
                }
                if (this.state.type === 'create') {
                    console.log('datatosend---', dataToSend)
                    const resCategory = await apiCreateProduct(dataToSend);
                    console.log('resCategory---', resCategory)
                    if(resCategory&& !resCategory.error){
                        this.props.addProduct(resCategory.data)
                    }
                }
                if (this.state.type === 'edit') {
                    dataToSend.id = this.state.selected.id;
                    const resCategory = await apiUpdateProductById(this.state.selected.id, dataToSend);
                  if(resCategory&& !resCategory.error){
                    console.log('edit---', resCategory)
                    this.props.updateProduct(resCategory.data)
                  }
                }
                setTimeout(() => {
                    this.setState({
                        visible: false
                    })
                }, 1000);
                this.props.form.resetFields()
            }
        });

    }
    handleSearch = (value) => {
        this.getProducts(value);
    }
    onSearchChange = (e) => {
        this.setState({
            name: e.target.value
        })
        this.handleSearch(e.target.value);
    }
    handleDelete = () => {
        this.props.deleteProduct(this.state.selected.id, this.state.name)
    }
    handleCancel = () => {
        this.props.form.resetFields();
        this.setState({
            visible: false,
        })
    }
    handleModalOpen = (type) => {
        this.setState({
            visible: true,
            type,

        })
    }
    showDetails = (e) => {
        this.setState({
            detailModal: true,
            selectedRow: e,
        })
    }
    handleCancelDetail = () => {
        this.setState({
            detailModal: false
        })
    }
    handleCancelOk = () => {
        this.setState({
            detailModal: false
        })
    }
    handlePathChange = (info) => {
      console.log("info for image: ", info)
        if (info.file.status === 'uploading') {
          this.setState({ loading: true });
          return;
        }
        if (info.file.status === 'done') {

          this.setState({
            imageUrl: info.file.response.url,
            loading: false,
          })

          // Get this url from response in real world.
          // getBase64(info.file.originFileObj, imageUrl => console.log("base64:", imageUrl));
        }
      }

    render() {
        const uploadButton = (
          <div>
            <Icon type={this.state.loading ? 'loading' : 'plus'} />
            <div className="ant-upload-text">{lang.upload}</div>
          </div>
        );

      const uploadProps = {
        headers: {
          authorization: `Bearer ${  localStorage.getItem('userToken')}`
        }
      };

        const { getFieldDecorator } = this.props.form;
        const { selected, type } = this.state;
        return (
          <Form className='stock-form'>
            <FormItem />
            <FormItem
              label={lang.barcode}
              style={{ display: 'flex' }}
            >
              {getFieldDecorator('barcode', {
                            initialValue: type === 'edit' ? selected.barcode : this.state.barkod,
                            rules: [{
                                required: false, message: lang.typeProductBarcode
                            }],
                        })(
                          <Input onChange={this.handleBarcode} />
                        )}
            </FormItem>
            <div>
              <FormItem
                label={lang.productCode}
                style={{ display: 'flex' }}
              >
                {getFieldDecorator('product_code', {
                                initialValue: type === 'edit' ? selected.product_code : '',
                                rules: [{
                                    required: true, message: lang.typeProductCode
                                }],
                            })(
                              <Input />
                            )}

              </FormItem>
              <FormItem
                label={lang.name}
                style={{ display: 'flex' }}
              >
                {getFieldDecorator('name', {
                                initialValue: type === 'edit' ? selected.name : '',
                                rules: [{
                                    required: true, message: lang.typeName
                                }],
                            })(
                              <Input />
                            )}

              </FormItem>
              <FormItem
                label={lang.description}
                style={{ display: 'flex' }}
              >
                {getFieldDecorator('description', {
                                initialValue: type === 'edit' ? selected.description : '',
                                rules: [{
                                    required: false
                                }],
                            })(
                              <Input />
                            )}
              </FormItem>
              <FormItem
                label={lang.category}
                style={{ display: 'flex' }}
              >
                {getFieldDecorator('category', {
                                initialValue: type === 'edit' ? selected.category : lang.others,
                                // rules: [{
                                //     required: false
                                // }],
                            })(
                              <Select >
                                {this.props.category.categories.map(category=>
                                  <Select.Option value={category.id}>{category.name}</Select.Option>
                                    )}
                              </Select>
                            )}
              </FormItem>

              {/* <FormItem
                label={lang.registrar}
                style={{ display: 'flex' }}
              >
                {getFieldDecorator('kaydeden', {
                          initialValue: type === 'edit' ? selected.userName : lang.username,
                          rules: [{
                            required: false, message: lang.typeRegistrar
                          }],
                        })(
                          <Input disabled />
                        )}
              </FormItem> */}

              <FormItem
                label={lang.buyingPrice}
                style={{ display: 'flex' }}
              >
                {getFieldDecorator('purchase_price', {
                                initialValue: type === 'edit' ? selected.purchase_price : '',
                                rules: [{
                                    required: true, message: lang.typeBuyingPrice
                                }],
                            })(
                              <InputNumber min={0} formatter={value => `${value + lang.currency}`} />
                            )}
              </FormItem>
              <FormItem
                label={lang.salePrice}
                style={{ display: 'flex' }}
              >
                {getFieldDecorator('sale_price', {
                                initialValue: type === 'edit' ? selected.sale_price : '',
                                rules: [{
                                    required: true, message: lang.typeSalePrice
                                }],
                            })(
                              <InputNumber min={0} formatter={value => `${value + lang.currency}`} />
                            )}
              </FormItem>
              <FormItem
                label={lang.totalQuantity}
                style={{ display: 'flex' }}
              >
                {getFieldDecorator('total_quantity', {
                                initialValue: type === 'edit' ? selected.total_quantity : 0,
                                rules: [{
                                    required: true, message: lang.typeQuantity
                                }],
                            })(
                              <InputNumber min={0}  />
                            )}
              </FormItem>
              {/* <FormItem> */}
              {/* <Upload {...props}> */}
              {/* <Button> */}
              {/* <Icon type="upload" /> Click to Upload */}
              {/* </Button> */}
              {/* </Upload> */}
              {/* </FormItem> */}
            </div>
          </Form>
        );
    }
}
