import React, { useState, useEffect } from 'react';
import { ArrowLeft, ImageIcon, Check, X, Loader2 } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const API_BASE_URL = 'https://fieldtriplinkbackend-production.up.railway.app/api';

const DriverDetails = () => {
  const { id } = useParams(); // Changed from driverId to id to match route param :id
  const navigate = useNavigate();
  const [driverData, setDriverData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalAction, setModalAction] = useState(null); // 'approve' or 'reject'
  const [rejectNotes, setRejectNotes] = useState('');

  useEffect(() => {
    console.log('Driver ID from params:', id); // Debug: Check if ID is captured

    const fetchDriver = async () => {
      if (!id) {
        console.warn('No id provided, skipping fetch'); // Debug
        setLoading(false);
        setError('No driver ID found in URL.');
        return;
      }

      setLoading(true);
      setError(null);
      const token = localStorage.getItem("admintoken");
      console.log('Token found:', !!token); // Debug: Confirm token exists

      if (!token) {
        console.error("No token found");
        setError('Authentication token missing.');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${API_BASE_URL}/superadmin/driver-by/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setDriverData(response.data.data);
      } catch (err) {
        console.error('Error fetching driver details:', err); // This will show in console
        setError(`Failed to load driver details: ${err.message}`);
        setDriverData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchDriver();
  }, [id]); // Changed dependency to id

  const refetchDriver = async () => {
    const token = localStorage.getItem("admintoken");
    if (!token) return;
    try {
      const response = await axios.get(`${API_BASE_URL}/superadmin/driver-by/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setDriverData(response.data.data);
    } catch (err) {
      console.error('Error refetching driver:', err);
    }
  };

  const handleStatusUpdate = async (newStatus, notes = null) => {
    if (!id) return;
    setActionLoading(true);
    const token = localStorage.getItem("admintoken");
    if (!token) {
      setActionLoading(false);
      return;
    }
    try {
      await axios.put(`${API_BASE_URL}/superadmin/drivers/${id}/status`, {
        status: newStatus,
        ...(notes && { notes }),
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      await refetchDriver();
      setShowModal(false);
      setRejectNotes('');
      if (newStatus === 'approved') {
        toast.success(`${basicInfo.name} is approved`);
      } else if (newStatus === 'rejected') {
        toast.success(`${basicInfo.name} is rejected`);
      }
    } catch (err) {
      toast.error(`Failed to update status: ${err.response?.data?.message || err.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  const openApproveModal = () => {
    setModalAction('approve');
    setShowModal(true);
  };

  const openRejectModal = () => {
    setModalAction('reject');
    setRejectNotes('');
    setShowModal(true);
  };

  const handleModalConfirm = () => {
    if (modalAction === 'approve') {
      handleStatusUpdate('approved');
    } else if (modalAction === 'reject') {
      handleStatusUpdate('rejected', rejectNotes.trim() || undefined);
    }
  };

  const handleCancel = () => {
    navigate(-1); // Go back to previous page (e.g., drivers list)
  };

  const handleImageClick = (url) => {
    if (url) {
      // Open in new tab for view/download
      window.open(url, '_blank');
    } else {
      console.log('No image URL available');
    }
  };

  const renderSkeletonPersonal = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i}>
          <div className="h-3 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
        </div>
      ))}
    </div>
  );

  const renderSkeletonDocuments = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i}>
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-3"></div>
          <div className="w-full aspect-video bg-gray-200 rounded-lg animate-pulse"></div>
        </div>
      ))}
    </div>
  );

  const renderSkeletonHeader = () => (
    <div className="flex items-center justify-between flex-wrap gap-3">
      <div className="h-8 bg-gray-200 rounded w-48"></div>
      <div className="hidden md:flex items-center gap-3">
        <div className="h-10 bg-gray-200 rounded-lg w-20"></div>
        <div className="h-10 bg-gray-200 rounded-lg w-32"></div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-gray-50">
        {/* Header Skeleton */}
        <div className="bg-[#FFFFFF] border-gray-200 mx-6 rounded-lg shadow-sm">
          <div className="px-4 sm:px-6 lg:px-8 py-4">
            {renderSkeletonHeader()}
          </div>
        </div>

        {/* Content Skeletons */}
        <div className="px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-6">
          {/* Personal Details Skeleton */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 mb-6">
            <div className="h-6 bg-gray-200 rounded w-32 mb-6"></div>
            {renderSkeletonPersonal()}
          </div>

          {/* Documents Skeleton */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="h-6 bg-gray-200 rounded w-40 mb-6"></div>
            {renderSkeletonDocuments()}
          </div>
        </div>

        {/* Bottom Action Buttons Skeleton - Mobile */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg z-10">
          <div className="flex gap-3">
            <div className="flex-1 h-12 bg-gray-200 rounded-lg"></div>
            <div className="flex-1 h-12 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !driverData) {
    return (
      <div className="w-full min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center max-w-md">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Error Loading Driver</h2>
          <p className="text-sm text-gray-600 mb-6">{error || 'Driver not found.'}</p>
          <button
            onClick={handleCancel}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const basicInfo = driverData.basicInfo || {};
  const profile = driverData.profile || {};
  const schoolApplication = driverData.schoolApplications?.[0] || {};
  const school = schoolApplication.school || {};
  const currentStatus = schoolApplication.status || 'pending';

  const hasAnyImage = profile.cnicFrontImage || profile.cnicBackImage || profile.drivingLicenseImage || profile.vehicleRegistrationImage;
  const showApprove = currentStatus === 'pending';
  const showReject = currentStatus === 'approved';

  return (
    <>
      <div className="w-full min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-[#FFFFFF] border-gray-200 mx-14 rounded-lg shadow-sm">
          <div className="px-4 mt-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className=" flex items-center gap-3">
                {/* <button
                  onClick={handleCancel}
                  className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <ArrowLeft size={20} />
                </button> */}
                <h1 className="text-2xl sm:text-3xl capitalize  font-bold text-gray-900 mt-4">
                  {basicInfo.name || 'N/A'}
                </h1>
              </div>
             
              <div className="hidden md:flex items-center gap-3">
                <button
                  onClick={handleCancel}
                  className=" cursor-pointer px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
                >
                  Cancel
                </button>
                {(showApprove || showReject) && (
                  <button
                    onClick={showApprove ? openApproveModal : openRejectModal}
                    disabled={actionLoading}
                    className="px-5 py-2 cursor-pointer bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                  >
                    {actionLoading ? (
                      <Loader2 className="animate-spin h-4 w-4" />
                    ) : showApprove ? (
                      <>
                        <Check size={16} />
                        Approve Driver
                      </>
                    ) : (
                      <>
                        <X size={16} />
                        Reject Driver
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          
          </div>
        </div>

        {/* Content */}
        <div className="px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-6 mx-0 sm:mx-6">
          {/* Personal Details Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 mb-6">
            <h2 className="text-[20px] archivo-semibold  text-[#333333] mb-6">Personal Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {basicInfo.name && (
                <div>
                  <label className="block text-[13px] archivoregular text-[#33333399] mb-2">Driver Name</label>
                  <p className="text-[14px] capitalize inter-medium text-[#333333E5]">{basicInfo.name}</p>
                </div>
              )}
              {basicInfo.email && (
                <div>
                  <label className="block text-[13px] archivoregular text-[#33333399] mb-2">Email</label>
                  <p className="text-[14px] capitalize inter-medium text-[#333333E5]">{basicInfo.email}</p>
                </div>
              )}
              {basicInfo.phone && (
                <div>
                  <label className="block text-[13px] archivoregular text-[#33333399] mb-2">Phone Number</label>
                  <p className="text-[14px] capitalize inter-medium text-[#333333E5]">{basicInfo.phone}</p>
                </div>
              )}
              
              {school.name && (
                <div>
                  <label className="block text-[13px] archivoregular text-[#33333399] mb-2">School Partner</label>
                  <p className="text-[14px] capitalize inter-medium text-[#333333E5]">{school.name}</p>
                </div>
              )}
              {profile.address && (
                <div>
                  <label className="block text-[13px] archivoregular text-[#33333399] mb-2">City</label>
                  <p className="text-[14px] capitalize inter-medium text-[#333333E5]">{profile.address}</p>
                </div>
              )}
            </div>
          </div>

          {/* Uploaded Documents Section - Only show if any image exists */}
          {hasAnyImage && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
              <h2 className="text-[20px] archivomedium  text-[#333333] mb-6">Uploaded Documents</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {/* CNIC Front */}
                <div>
                  <label className="block  text-[18px] archivomedium text-[#333333CC] mb-3">State Drivers License</label>
                  <button
                    onClick={() => handleImageClick(profile.cnicFrontImage)}
                    className="w-full aspect-video bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-all flex items-center justify-center group"
                  >
                    {profile.cnicFrontImage ? (
                      <img
                        src={profile.cnicFrontImage}
                        alt="CNIC Front"
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <div className="text-center">
                        <ImageIcon size={48} className="mx-auto text-gray-400 group-hover:text-gray-500 mb-2" />
                        <p className="text-xs sm:text-sm text-gray-500">No image uploaded</p>
                      </div>
                    )}
                  </button>
                </div>

                {/* CNIC Back */}
                <div>
                  <label className="block  text-[18px] archivomedium text-[#333333CC] mb-3">School bus driver certification card</label>
                  <button
                    onClick={() => handleImageClick(profile.cnicBackImage)}
                    className="w-full aspect-video bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-all flex items-center justify-center group"
                  >
                    {profile.cnicBackImage ? (
                      <img
                        src={profile.cnicBackImage}
                        alt="CNIC Back"
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <div className="text-center">
                        <ImageIcon size={48} className="mx-auto text-gray-400 group-hover:text-gray-500 mb-2" />
                        <p className="text-xs sm:text-sm text-gray-500">No image uploaded</p>
                      </div>
                    )}
                  </button>
                </div>

                {/* Driving License */}
                <div>
                  <label className="block text-[18px] archivomedium text-[#333333CC] mb-3">
                    BCI/FBI Background check verification papers
                  </label>
                  <button
                    onClick={() => handleImageClick(profile.drivingLicenseImage)}
                    className="w-full aspect-video bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-all flex items-center justify-center group"
                  >
                    {profile.drivingLicenseImage ? (
                      <img
                        src={profile.drivingLicenseImage}
                        alt="Driving License"
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <div className="text-center">
                        <ImageIcon size={48} className="mx-auto text-gray-400 group-hover:text-gray-500 mb-2" />
                        <p className="text-xs sm:text-sm text-gray-500">No image uploaded</p>
                      </div>
                    )}
                  </button>
                </div>

                {/* Vehicle Registration */}
                <div>
                  <label className="block  text-[18px] archivomedium text-[#333333CC] mb-3">
                  Driver Photo  
                  </label>
                  <button
                    onClick={() => handleImageClick(profile.vehicleRegistrationImage)}
                    className="w-full aspect-video bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-all flex items-center justify-center group"
                  >
                    {profile.vehicleRegistrationImage ? (
                      <img
                        src={profile.vehicleRegistrationImage}
                        alt="Vehicle Registration"
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <div className="text-center">
                        <ImageIcon size={48} className="mx-auto text-gray-400 group-hover:text-gray-500 mb-2" />
                        <p className="text-xs sm:text-sm text-gray-500">No image uploaded</p>
                      </div>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Action Buttons - Mobile Fixed */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg z-10">
          <div className="flex gap-3">
            <button
              onClick={handleCancel}
              className="flex-1 px-4 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 active:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            {(showApprove || showReject) && (
              <button
                onClick={showApprove ? openApproveModal : openRejectModal}
                disabled={actionLoading}
                className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 active:bg-red-800 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
              >
                {actionLoading ? (
                  <Loader2 className="animate-spin h-4 w-4" />
                ) : showApprove ? (
                  <>
                    <Check size={16} />
                    Approve Driver
                  </>
                ) : (
                  <>
                    <X size={16} />
                    Reject Driver
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm  bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {modalAction === 'approve' ? 'Approve Driver' : 'Reject Driver'}
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                {modalAction === 'approve'
                  ? 'Are you sure you want to approve this driver? This action cannot be undone.'
                  : 'Are you sure you want to reject this driver? This action cannot be undone.'}
              </p>
              {modalAction === 'reject' && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Rejection Notes (Optional)</label>
                  <textarea
                    value={rejectNotes}
                    onChange={(e) => setRejectNotes(e.target.value)}
                    placeholder="Enter reason for rejection..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                    rows={3}
                  />
                </div>
              )}
              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={() => setShowModal(false)}
                  className=" cursor-pointer px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>


                <button
                  onClick={handleModalConfirm}
                  disabled={actionLoading}
                  className=" cursor-pointer px-4 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                >
                  {actionLoading ? (
                    <Loader2 className="animate-spin h-4 w-4" />
                  ) : (
                    <>
                      {modalAction === 'approve' ? <Check size={16} /> : <X size={16} />}
                      {modalAction === 'approve' ? 'Approve' : 'Reject'}
                    </>
                  )}
                </button>

                
              </div>
            </div>
          </div>
        </div>
      )}

      <ToastContainer position="top-right" />
    </>
  );
};

export default DriverDetails;