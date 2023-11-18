// components/Navigation.jsx
import React from 'react';
import Link from 'next/link';

const Navigation = () => {
  return (
    <nav>
      <ul>
        <li>
        <Link href="/about">About</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
