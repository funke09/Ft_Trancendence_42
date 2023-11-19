// components/Navigation.jsx
import React from 'react';
import Link from 'next/link';

const Navigation = () => {
  return (
    <nav style={styles.nav}>
      <ul style={styles.navList}>
        <li style={styles.navItem}>
          <Link href="/">Home
          </Link>
        </li>
        <li style={styles.navItem}>
          <Link href="/about">About
          </Link>
        </li>
        <li style={styles.navItem}>
          <Link href="/login">Login
          </Link>
        </li>
        <li style={styles.navItem}>
          <Link href="/signup">Signup
          </Link>
        </li>
        <li style={styles.navItem}>
          <Link href="/chat">Chat
          </Link>
        </li>
      </ul>
    </nav>
  );
};

const styles = {
  nav: {
    background: '#333333', // Dark gray background for the navigation bar
    padding: '10px',
  },
  navList: {
    listStyle: 'none',
    margin: 0,
    padding: 0,
    display: 'flex',
    justifyContent: 'space-around',
  },
  navItem: {
    marginRight: '10px',
  },
  navLink: {
    color: '#FFFFFF', // White color for navigation links
    textDecoration: 'none',
  },
};

export default Navigation;
