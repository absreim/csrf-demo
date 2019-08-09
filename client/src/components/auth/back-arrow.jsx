import React from 'react'

const BackArrow = props => {
  const {viewBox, outerClass, triangleClass} = props
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={viewBox} className={outerClass}
    >
      <title>Auth Menu Back Button Image</title>
      <polygon
        className={triangleClass}
        points="1.98 17.89 16.78 0 16.78 35.78 1.98 17.89"
      />
      <polygon
        className={triangleClass}
        points="19.11 18 33.91 0.11 33.91 35.89 19.11 18"
      />
    </svg>
  )
}

export default BackArrow
