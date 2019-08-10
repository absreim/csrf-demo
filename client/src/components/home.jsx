import React from 'react'

const Home = () => (
  <main>
    <h1 className="main-title">Welcome to CORS Bank!</h1>
    <img className="main-logo" src="cors_bank_logo.svg" />
    <p>This mock banking site is part of a demonstration of the
      CSRF security vulnerability.</p>
    <p>The demonstration consists of an&nbsp;
      <a href="https://portfolio.brook.li/articles/1/">
        accompanying article
      </a>
      &nbsp;that explains the motivation behind the site and
      includes instructions for using the site.
    </p>
    <p>The <a href="https://github.com/absreim/csrf-demo">source code</a>
      &nbsp;for the site is available on Github.</p>
  </main>
)

export default Home
