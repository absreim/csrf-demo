import React from 'react'

const CloseIcon = props => {
  const {outerClass, lineClass, viewBox} = props
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={viewBox} className={outerClass}
    >
      <title>Auth Menu Close Button Image</title>
      <line className={lineClass} x2="36" y2="36" />
      <line className={lineClass} y1="36" x2="36" />
    </svg>
  )
}

export default CloseIcon
