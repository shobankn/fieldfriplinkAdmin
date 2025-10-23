import React from 'react';
import { Menu } from 'lucide-react';

const AdminTopBar = ({ onMenuClick }) => {
  return (
    <div className="flex items-center justify-between bg-white border border-gray-200 py-9">
      {/* Left Section */}
      <div className="flex items-center">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-1 rounded-md hover:bg-gray-100"
        >
          <Menu className="w-5 h-5 text-gray-600" />
        </button>
        <div className="hidden lg:block w-12"></div>
      </div>

      <div className='flex'>
      </div>
    </div>
  );
};

export default AdminTopBar;