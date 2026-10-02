import React from 'react';
import { Link } from 'react-router-dom';

const AuthHeader: React.FC = () => {
  return (
    <Link to="/" className="flex items-center justify-center gap-3 mb-8">
      <img src="/landscape-logo.png" alt="Lqaly" className="h-10 w-auto" />
    </Link>
  );
};

export default AuthHeader;