import React, { useState } from 'react'
import AdminSidebar from '../sidebar/AdminSidebar';
import AdminTopBar from '../sidebar/AdminTopbar';
import DriverDetails from './DriverDetails';


function DriversDetailsPage() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    
      <div className="flex bg-gray-50 min-h-screen">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col min-h-screen lg:ml-58">
        <AdminTopBar onMenuClick={() => setSidebarOpen(true)} className="lg:ml-58" />
        
        <main className="flex-1  lg:p-6 overflow-y-auto">
            <DriverDetails />
        </main>
      </div>
    </div>
  )
}

export default DriversDetailsPage;


