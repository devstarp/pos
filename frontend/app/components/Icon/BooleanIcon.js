import React, { Fragment } from 'react';
import {CheckOutlined, CloseOutlined} from '@ant-design/icons'
import PropTypes from 'prop-types';
import { isBoolean } from 'lodash';

const BooleanIcon=({value, ...props})=>
  isBoolean(value) ? value ? <CheckOutlined  {...props} />:<CloseOutlined {...props} />:<Fragment />

BooleanIcon.propTypes = {
  value: PropTypes.bool,
};

BooleanIcon.defaultProps={
  value: undefined, 
}
  
export default BooleanIcon