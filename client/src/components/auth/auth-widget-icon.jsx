import React from 'react'

const AuthWidgetIcon = (props) => {
  const {outerClass, headClass, bodyClass, viewBox} = props
  return (
    <svg
      className={outerClass} xmlns="http://www.w3.org/2000/svg"
      viewBox={viewBox}
    >
      <title>Authorization Widget Menu Toggle Icon</title>
      <circle className={headClass} cx="36" cy="18" r="18" />
      <path className={bodyClass} d="M36,72H0a36,36,0,0,1,72,0Z" />
    </svg>
  )
}

export default AuthWidgetIcon
