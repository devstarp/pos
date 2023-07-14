import React, { Component } from 'react';
import { Table, Button, Icon, Modal, Form, Input, InputNumber, Upload, Popconfirm, Dropdown, Menu, Select } from "antd";
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { setProducts, setProduct, addProduct, deleteProduct, updateProduct} from '../redux/slices/product'
import { setCategories } from '../redux/slices/category'
import moment from 'moment'
import { CustomImage } from '../assets/ProductPhotos/CustomImage'
import {lang,pHost} from '../services/config'
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

class ProductPage extends Component<Props> {
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
    componentDidMount() {
      // this.props.retrieveProducts(this.state.name);
      this.getProducts()
      this.getCategories()
    }
    getProducts= async()=>{
      const resProducts = await apiGetProducts();
      console.log('resProdu--', resProducts)
      if(resProducts &&!resProducts.error){
        this.props.setProducts(resProducts.data)
      }
    }
    getCategories= async()=>{
      const resCategories = await apiGetCategories();
      if(resCategories&& !resCategories.error){
        this.props.setCategories(resCategories.data)
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

      const menu = (
        <Menu>
          <MenuItem>
            <Button onClick={() => this.handleModalOpen('edit')} style={{ border: '0', background: 'transparent' }}><Icon type="edit" /> Düzenle</Button>
          </MenuItem>
          <MenuItem>
            <Popconfirm placement="topLeft" title={lang.areUSureToRemoveItem} onConfirm={this.handleDelete} okText="Yes" cancelText="No"><Button style={{ border: '0', background: 'transparent' }}><Icon type="delete" /> {lang.delete}</Button></Popconfirm>
          </MenuItem>
        </Menu>
      );

      const columns = [
        // {
        //     title: 'Detay',
        //     key: 'detail',
        //     render: (record) =>
        //         <Button onClick={this.showDetails} style={{ border: 'none', background: 'transparent' }}> <Icon type='search' /></Button>
        // },
        {
          title: <div><Icon type="barcode" theme="outlined" style={{fontSize:'1.3em'}} /> {lang.barcode}</div>,
          dataIndex: 'barcode',
          key: 'barcode',
        }, {
          title: <div><Icon type="profile" theme="outlined" style={{fontSize:'1.3em'}} /> {lang.name}</div>,
          dataIndex: 'name',
          key: 'name',
        }, {
          title: <div><Icon type="profile" theme="outlined" style={{fontSize:'1.3em'}} /> {lang.description}</div>,
          dataIndex: 'description',
          key: 'description',
        },
        {
          title: <div><Icon type="appstore" theme="outlined" style={{fontSize:'1.3em'}} /> {lang.category}</div>,
          dataIndex: 'category',
          key: 'category',
        },
        {
          title: <div><Icon type="dollar" theme="outlined" style={{fontSize:'1.2em'}} /> {lang.buyingPrice}</div>,
          dataIndex: 'purchasePrice',
          key: 'purchasePrice',
          // sorter: (a, b) => a.purchasePrice - b.purchasePrice,
        },
        {
          title: <div><Icon type="dollar" theme="outlined" style={{fontSize:'1.2em'}} /> {lang.salePrice}</div>,
          dataIndex: 'salePrice',
          key: 'salePrice',
        },
        // {
        //     title: 'Kaydeden',
        //     dataIndex: 'userName',
        //     key: 'userName',
        // },
        {
          title: <div><Icon type="calendar" theme="outlined" style={{fontSize:'1.2em'}} /> {lang.registerDate}</div>,
          dataIndex: 'updated_at',
          key: 'updated_at',
          render: (date) =><div>{formatDate(date)}</div>
        },
        {
          title: lang.actions,
          render: () => (<Dropdown overlay={menu} trigger={['click']}>
            <Icon type="ellipsis" style={{ fontSize: '21px' }} />
          </Dropdown>)
        },
        // {
        //     title: 'Duzenle',
        //     render: () => <Button onClick={() => this.handleModalOpen('edit')} style={{ border: '0', background: 'transparent' }}><Icon type="edit" /></Button>
        // },
        // {
        //     title: 'Sil',
        //     render: () => <Popconfirm placement="topLeft" title={'Silmek istediginizden emin misiniz?'} onConfirm={this.handleDelete} okText="Yes" cancelText="No"><Button style={{ border: '0', background: 'transparent' }}><Icon type="delete" /></Button></Popconfirm>
        // },

      ]
      const { selected, type } = this.state;
      return (
        <div>
          <div className='page-header' >
            <div className='header-h'>{lang.products}</div>
            <div style={{ display: 'flex' }}>
              <Search
                style={{ height: '32px', marginRight: '10px' }}
                placeholder={lang.searchProduct}
                onSearch={this.handleSearch}
                onChange={this.onSearchChange}
              />
              <Button onClick={() => this.handleModalOpen('create')} >{lang.createNewProduct}<Icon type='plus' /></Button>
            </div>
          </div>
          <div className='page-body'>
            <Table
              dataSource={this.props.product.products}
              columns={columns}
              rowKey={(record) => record.id + 1}
              onRow={(record) => ({
                onClick: () => this.setState({
                  selected: record,
                  imageUrl: record.imagePath,
                })
              })}
              pagination={{showSizeChanger: true, 
                pageSizeOptions: ["6","8","10","15","20"], 
                hideOnSinglePage: true,
                defaultPageSize: 8

              }}
            />
          </div>

          {/* <Modal
              title={this.state.type === 'edit' ? lang.editProduct : lang.newProduct}
              visible={this.state.visible}
              onCancel={this.handleCancel}
              footer={[
                <Button onClick={this.handleCancel}>{lang.cancel}</Button>,
                <Button type="primary" onClick={this.handleOk}>
                  {lang.save}
                </Button>,
                    ]}
            >
              <div style={{display:'flex', justifyContent:'center',marginBottom:'24px'}}>

                <Upload
                  listType="picture-card"
                  className="avatar-uploader"
                  name="file"
                  showUploadList={false}
                  action={`${pHost }/uploadFile`}
                  onChange={this.handlePathChange}
                  {...uploadProps}
                >
                  {this.state.imageUrl ? <img src={this.state.imageUrl} alt="avatar" width={118} height={118} /> : uploadButton}
                </Upload>

              </div>
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

          {/* <FormItem
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
                  </FormItem> */}
          {/* <FormItem> */}
          {/* <Upload {...props}> */}
          {/* <Button> */}
          {/* <Icon type="upload" /> Click to Upload */}
          {/* </Button> */}
          {/* </Upload> */}
          {/* </FormItem> */}
          {/* </div>
              </Form>
            </Modal> */}
          <Modal
            title="Ürün Detayı"
            visible={this.state.detailModal}
            onCancel={this.handleCancelDetail}
            onOk={this.handleOkDetail}
            width={800}
            height={400}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ border: '1px solid #e6e6e6', width: '500px', height: '300px' }}>
                {/* <CustomImage height={'300px'} width={'300px'}  divWith={'exist'} name ={1}/> */}
                <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center' }}><Button style={{ border: 'none', height: '100%', width: '100%' }} /></div>
              </div>
              <div />
            </div>
          </Modal>

        </div>
      );
    }
}

const mapStateToProps = (state) => ({
  product: typeof state.get('product').toJS === 'function' ? state.get('product').toJS() : state.get('product'),
  category: typeof state.get('category').toJS === 'function' ? state.get('category').toJS() : state.get('category'),
});
  

export default connect(mapStateToProps, { setCategories,
  setProducts, setProduct, addProduct, deleteProduct, updateProduct })(ProductPage)