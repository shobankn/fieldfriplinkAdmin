import React, { useState, useEffect } from 'react';
import { Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = 'https://fieldtriplinkbackend-production.up.railway.app/api';

const DriversManagement = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [drivers, setDrivers] = useState([]);
  const [pagination, setPagination] = useState({});
  const navigate = useNavigate();
  
  const fetchDrivers = async (page) => {
    setLoading(true);

      const token = localStorage.getItem("admintoken"); // ✅ Get token

    if (!token) {
      console.error("No token found");
      return;
    }
    try {
      const params = { page, limit: 10 };
      if (activeTab !== 'all') {
        params.status = activeTab;
      }
       // ✅ Add Authorization header with Bearer token
    const response = await axios.get(`${API_BASE_URL}/superadmin/drivers`, {
      params,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
      setDrivers(response.data.data || []);
      setPagination({
        currentPage: response.data.currentPage,
        totalPages: response.data.totalPages,
        totalItems: response.data.totalItems,
      });
    } catch (error) {
      console.error('Error fetching drivers:', error);
      setDrivers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrivers(currentPage);
  }, [activeTab, currentPage]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-[#08870B14] text-[#08870B]';
      case 'pending':
        return 'bg-[#FFCC0014] text-[#FFCC00]';
      case 'rejected':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusText = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const handleCardClick = (driverId) => {
    navigate(`/drivers/${driverId}`);
  };

  const renderSkeletonDesktop = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
      <div className="grid grid-cols-12 gap-4 items-center">
        <div className="col-span-2">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mt-2"></div>
        </div>
        <div className="col-span-2">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
        </div>
        <div className="col-span-1">
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="col-span-2">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
        </div>
        <div className="col-span-1">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
        <div className="col-span-2">
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="col-span-2">
          <div className="h-10 bg-gray-200 rounded w-20"></div>
        </div>
      </div>
    </div>
  );

  const renderSkeletonTablet = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 animate-pulse">
      <div className="grid grid-cols-2 gap-4 mb-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
      <div className="h-10 bg-gray-200 rounded w-full"></div>
    </div>
  );

  const renderSkeletonMobile = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 animate-pulse">
      <div className="space-y-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-5 bg-gray-200 rounded w-3/4 mt-2"></div>
          </div>
          <div className="h-6 bg-gray-200 rounded w-16"></div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
            </div>
          ))}
        </div>
        <div className="h-10 bg-gray-200 rounded w-full"></div>
      </div>
    </div>
  );

  return (
    <div className="w-full">

      {/* Header Section - No background, integrated with page */}
      <div className="">
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Drivers Management
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Review and approve driver applications
          </p>
        </div>

        {/* Tabs Navigation */}
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 ">
            <button
              onClick={() => handleTabChange('all')}
              className={`pb-1 cursor-pointer px-1 text-sm inter-medium text-[14px] transition-colors relative ${
                activeTab === 'all'
                  ? 'text-red-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              All
              {activeTab === 'all' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600"></div>
              )}
            </button>
            <button
              onClick={() => handleTabChange('pending')}
              className={` pb-1 cursor-pointer px-1 text-sm inter-medium text-[14px] transition-colors relative ${
                activeTab === 'pending'
                  ? 'text-red-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Pending
              {activeTab === 'pending' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600"></div>
              )}
            </button>
            <button
              onClick={() => handleTabChange('approved')}
              className={`pb-1 cursor-pointer px-1 text-sm inter-medium text-[14px] transition-colors relative ${
                activeTab === 'approved'
                  ? 'text-red-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Approved
              {activeTab === 'approved' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600"></div>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Content Section - Scrollable area */}
      <div className="px-4 sm:px-6 lg:px-8 mx-6 py-6 mt-4 bg-[#FFFFFF] border-[#CCCCCC80] border rounded-2xl ">
        {/* Desktop Table View */}
        <div className="hidden lg:block space-y-4">
          {loading ? (
            Array.from({ length: 5 }).map((_, index) => (
              <div key={index}>{renderSkeletonDesktop()}</div>
            ))
          ) : (
            drivers.map((driver) => (
             <div
  key={driver.driverId}
  className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow cursor-pointer"
  onClick={() => handleCardClick(driver.driverId)}
>
  <div className="grid grid-cols-12 gap-x-6 gap-y-3 items-center">
    
    {/* Driver Name */}
    <div className="col-span-12 sm:col-span-3">
      <p className="text-[13px] archivoregular text-[#33333399] mb-1">Driver Name</p>
      <p className="text-[14px] capitalize inter-medium text-[#333333E5] truncate">{driver.name}</p>
    </div>


    {/* School Partner */}
    <div className="col-span-12 sm:col-span-3">
      <p className="text-[13px] archivoregular text-[#33333399] mb-1">School Partner</p>
      <p className="text-[14px] capitalize inter-medium text-[#333333E5] truncate">
        {driver.school?.name || "N/A"}
      </p>
    </div>

    {/* Phone */}
    <div className="col-span-12 sm:col-span-2">
      <p className="text-[13px] archivoregular text-[#33333399] mb-1">Phone</p>
      <p className="text-[14px] capitalize inter-medium text-[#333333E5] truncate">{driver.phone}</p>
    </div>

    {/* Status */}
    <div className="col-span-12 sm:col-span-2">
      <p className="text-[13px] archivoregular text-[#33333399] mb-1">Status</p>
      <span
        className={`inline-block px-3 py-1 rounded-full text-[14px] capitalize inter-medium ${getStatusColor(
          driver.status
        )}`}
      >
        {getStatusText(driver.status)}
      </span>
    </div>

    {/* Actions */}
    <div className="col-span-12 sm:col-span-2 flex sm:justify-end">
      <div>
        <p className="text-[13px] archivoregular text-[#33333399] mb-1">Actions</p>
        <button className= " cursor-pointer bg-[#E83E3E] hover:bg-red-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2">
          <Eye className="w-4 h-4" />
          Review
        </button>
      </div>
    </div>

  </div>
            </div>

            ))
          )}
        </div>

        {/* Tablet View */}
        <div className="hidden md:block lg:hidden space-y-4">
          {loading ? (
            Array.from({ length: 5 }).map((_, index) => (
              <div key={index}>{renderSkeletonTablet()}</div>
            ))
          ) : (
            drivers.map((driver) => (
              <div
                key={driver.driverId}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => handleCardClick(driver.driverId)}
              >
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-[13px] archivoregular text-[#33333399] mb-1">Driver Name</p>
                    <p className="text-[14px] capitalize inter-medium text-[#333333E5]">{driver.name}</p>
                  </div>
                  <div>
                    <p className="text-[13px] archivoregular text-[#33333399] mb-1">Email</p>
                    <p className="text-[14px] capitalize inter-medium text-[#333333E5]">{driver.email}</p>
                  </div>
                  <div>
                    <p className="text-[13px] archivoregular text-[#33333399] mb-1">City</p>
                    <p className="text-[14px] capitalize inter-medium text-[#333333E5]">{driver.address}</p>
                  </div>
                  <div>
                    <p className="text-[13px] archivoregular text-[#33333399] mb-1">School Partner</p>
                    <p className="text-[14px] capitalize inter-medium text-[#333333E5]">{driver.school?.name || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-[13px] archivoregular text-[#33333399] mb-1">Phone</p>
                    <p className="text-[14px] capitalize inter-medium text-[#333333E5]">{driver.phone}</p>
                  </div>
                  <div>
                    <p className="text-[13px] archivoregular text-[#33333399] mb-1">Status</p>
                    <span className={`inline-block px-3 py-1 rounded-full text-[14px] capitalize inter-medium text-[#333333E5] ${getStatusColor(driver.status)}`}>
                      {getStatusText(driver.status)}
                    </span>
                  </div>
                </div>
                <button className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2">
                  <Eye size={16} />
                  Review
                </button>
              </div>
            ))
          )}
        </div>

        {/* Mobile View */}
        <div className="md:hidden space-y-4">
          {loading ? (
            Array.from({ length: 5 }).map((_, index) => (
              <div key={index}>{renderSkeletonMobile()}</div>
            ))
          ) : (
            drivers.map((driver) => (
              <div
                key={driver.driverId}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => handleCardClick(driver.driverId)}
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="text-[13px] archivoregular text-[#33333399] mb-1">Driver Name</p>
                      <p className="text-[14px] capitalize inter-medium text-[#333333E5]">{driver.name}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(driver.status)}`}>
                      {getStatusText(driver.status)}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-[13px] archivoregular text-[#33333399] mb-1">Email</p>
                      <p className="text-[14px] capitalize inter-medium text-[#333333E5] truncate">{driver.email}</p>
                    </div>
                    <div>
                      <p className="text-[13px] archivoregular text-[#33333399] mb-1">Phone</p>
                      <p className="text-[14px] capitalize inter-medium text-[#333333E5]">{driver.phone}</p>
                    </div>
                    <div>
                      <p className="text-[13px] archivoregular text-[#33333399] mb-1">City</p>
                      <p className="text-[14px] capitalize inter-medium text-[#333333E5]">{driver.address}</p>
                    </div>
                    <div>
                      <p className="text-[13px] archivoregular text-[#33333399] mb-1">School Partner</p>
                      <p className="text-[14px] capitalize inter-medium text-[#333333E5]">{driver.school?.name || 'N/A'}</p>
                    </div>
                  </div>

                  <button className="w-full bg-red-600 hover:bg-red-700 active:bg-red-800 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2">
                    <Eye size={16} />
                    Review
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Empty State */}
        {!loading && drivers.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <p className="text-gray-500 text-base">No drivers found in this category.</p>
          </div>
        )}

        {/* Pagination */}
        {!loading && pagination.totalPages > 1 && (
          <div className="mt-6 flex justify-between items-center px-4">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage <= 1}
              className="disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors"
            >
              Previous
            </button>
            <span className="text-sm text-gray-500">
              Page {currentPage} of {pagination.totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(pagination.totalPages, prev + 1))}
              disabled={currentPage >= pagination.totalPages}
              className="disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DriversManagement;