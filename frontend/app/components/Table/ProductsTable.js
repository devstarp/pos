import React, { useContext, useEffect, useRef, useState, createContext } from 'react';
import { Button, Form, Input, Popconfirm, Table } from 'antd';
import {lang} from '../../services/config'
import EditableCell, {EditableRow} from './EditableCell';

const Productstable = ({selectedProducts, onSelectProduct, onSelectAllProducts,  ...props}) => {
  const columns = [
    {
      title: lang.name,
      dataIndex: 'name',
      fixed:'left',
      key: 'name',
    },{
      title: lang.barcode,
      dataIndex: 'barcode',
      key: 'barcode',
    },{
      title: lang.description,
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: lang.category,
      dataIndex: ['category','name'],
      key: 'category',
    },
    {
      title: lang.buyingPrice,
      dataIndex: 'purchase_price',
      key: 'purchase_price',
    // sorter: (a, b) => a.purchasePrice - b.purchasePrice,
    },
    {
      title: lang.buyingPrice,
      dataIndex: 'purchase_currency',
      key: 'purchase_currency',
    // sorter: (a, b) => a.purchasePrice - b.purchasePrice,
    },
    {
      title: lang.salePrice,
      dataIndex: 'sale_price',
      key: 'sale_price',
    },
    {
      title: lang.salePrice,
      dataIndex: 'sale_currency',
      key: 'sale_currency',
      // sorter: (a, b) => a.purchasePrice - b.purchasePrice,
    },
  ]
  // console.log('selectedProducts---', selectedProducts)
  return (
    <Table
      columns={columns}
      rowSelection={{
        selections:selectedProducts,
        onSelect:onSelectProduct,
        onSelectAll:onSelectAllProducts
      }}
      rowKey={(record) => record.id}
      // onRow={(record) => ({
      //                           onClick: () =>onSelectProduct(record)
      //                       })}
      pagination={{showSizeChanger: true, 
        pageSizeOptions: ["6","8","10","15","20"], 
        hideOnSinglePage: true,
        defaultPageSize: 8

      }}
      {...props}
    />
  );
};

export default Productstable;