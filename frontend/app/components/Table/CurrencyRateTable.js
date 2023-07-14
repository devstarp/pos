import React, { useContext, useEffect, useRef, useState, createContext } from 'react';
import { Button, Form, Input, Popconfirm, Table } from 'antd';
import {lang} from '../../services/config'
import EditableCell, {EditableRow} from './EditableCell';

const CurrencyRateTable = ({...props}) => {
  const columns = [
    {
      title: lang.currencyType,
      dataIndex: 'name',
      key: 'name',
    },{
      title: lang.purhcasePrice,
      dataIndex: 'purchase_price',
      key: 'purchase_price',
    },{
      title: lang.salePrice,
      dataIndex: 'sale_price',
      key: 'sale_price',
    }
  ]
  return (
    <Table
      columns={columns}
      pagination={{hideOnSinglePage:true}}
      {...props}
    />
  );
};

export default CurrencyRateTable;