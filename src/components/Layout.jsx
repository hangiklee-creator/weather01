import React from 'react';

const Layout = ({ children }) => {
  return (
    <div className="app-container">
      <div className="glass-overlay">
        {children}
      </div>
    </div>
  );
};

export default Layout;
