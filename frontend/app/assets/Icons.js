import React from 'react';

export const Icons = ({ iconName, height }) => {
  const txt =`url(./assets/icons/${iconName}.svg) center / contain no-repeat`
  return (
    <img alt={iconName}  className='icon' style={height ? { height,width:height,background:txt} : { height:'35px',width:'35px',background:txt}}  />
  )

}