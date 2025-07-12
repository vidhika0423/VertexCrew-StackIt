import React from 'react';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="nav-container">
        <h1>StackIt</h1>
        <ul className="nav-menu">
          <li><a href="/">Home</a></li>
          <li><a href="/questions">Questions</a></li>
          <li><a href="/ask">Ask Question</a></li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
