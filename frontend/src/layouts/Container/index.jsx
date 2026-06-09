//Layout.jsx
import React from 'react';
import Header from './Header';
import Footer from './Footer';
import './Layout.css'; 

function Layout({ children }) {
  return (
    <div className="layout-wrapper">
      {/* 이제 Header를 띄우면 그 안에 Navigator까지 한 번에 묶여서 나옵니다. */}
      <Header />

      <div className="layout-body">
        {/* <Navigator /> 가 있던 자리를 제거합니다. */}
        <main className="layout-content">
          {children}
        </main>
      </div>

      <Footer />
    </div>
  );
}

export default Layout;