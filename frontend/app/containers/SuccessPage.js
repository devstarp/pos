import React, { Fragment } from 'react';
import { Button, Result } from 'antd';
import { get } from 'lodash';

const SuccessPage = ({title, history}) => {
  console.log('history---;', history.location)
  const order =get(history, 'location.state.order')
  const subTitle=(
    <Fragment>
      {`Order number:${order.order_number}`}
    </Fragment>
  )  
  return(
    <Result
      status="success"
      title="Successfully Purchased!"
      subTitle={subTitle}
      extra={[
        <Button type="primary" key="console">
          Go Console
        </Button>,
        <Button key="buy">Buy Again</Button>,
      ]}
    />
  )};

export default SuccessPage;