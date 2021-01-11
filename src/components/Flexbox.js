import React from 'react'

const Flexbox = ({children, style, ...otherProps}) => {
  return (
  <div {...otherProps} style={{display: 'flex', ...style}}>
    {children}
  </div>
  )
}

export default Flexbox;