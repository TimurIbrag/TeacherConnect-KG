
import React from 'react';
import { Link } from 'react-router-dom';
import { Laptop } from 'lucide-react';

const BrandLogo: React.FC = () => {
  return (
    <div className="flex items-center gap-2">
      <Link to="/" className="flex items-center">
        <Laptop className="h-5 w-5 text-primary mr-2" />
        <span className="text-xl font-bold text-primary">TeacherConnect</span>
        <span className="text-accent ml-1 font-semibold">KG</span>
      </Link>
    </div>
  );
};

export default BrandLogo;
