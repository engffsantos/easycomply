import React from 'react';

const Navbar = () => {
  return (
    <nav className="navbar" style={{ backgroundColor: '#333', color: 'white', padding: '10px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div className="navbar-brand" style={{ fontSize: '1.5em' }}>EasyComply</div>
      <ul className="navbar-links" style={{ listStyle: 'none', display: 'flex', gap: '20px', margin: 0, padding: 0 }}>
        <li><a href="/dashboard" style={{ color: 'white', textDecoration: 'none' }}>Dashboard</a></li>
        <li><a href="#" style={{ color: 'white', textDecoration: 'none' }}>Profile</a></li>
        <li><a href="#" style={{ color: 'white', textDecoration: 'none' }}>Settings</a></li>
        <li><button onClick={() => alert('Logout action here')} style={{ background: 'red', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer' }}>Logout</button></li>
      </ul>
    </nav>
  );
};

export default Navbar;
