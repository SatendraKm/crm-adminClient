// pages/RegionsPage.tsx
import React, { useState, useEffect } from 'react';
import type { Region } from './types/RegionTypes';
import { regionService } from './services/regionService';
import RegionTable from './components/RegionTable';

const Regions: React.FC = () => {
  const [regions, setRegions] = useState<Region[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRegions = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await regionService.getRegions();

      if (response.success) {
        setRegions(response.data);
      } else {
        setError('Failed to fetch regions data');
      }
    } catch (err) {
      setError('Error loading regions data. Please try again.');
      console.error('Error fetching regions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegions();
  }, []);

  const handleRefresh = () => {
    fetchRegions();
  };

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Regions Management
            </h1>
            <p className="text-gray-600 mt-1">
              Manage and view regional assignments
            </p>
          </div>
          <button
            className="btn btn-primary"
            onClick={handleRefresh}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                Loading...
              </>
            ) : (
              <>
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Refresh
              </>
            )}
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="stat bg-base-100 rounded-box shadow">
            <div className="stat-title">Total Regions</div>
            <div className="stat-value text-primary">{regions.length}</div>
          </div>
          <div className="stat bg-base-100 rounded-box shadow">
            <div className="stat-title">Active Regions</div>
            <div className="stat-value text-success">
              {regions.filter((r) => r.is_active === 'Active').length}
            </div>
          </div>
          <div className="stat bg-base-100 rounded-box shadow">
            <div className="stat-title">Projects</div>
            <div className="stat-value text-secondary">
              {new Set(regions.map((r) => r.Project)).size}
            </div>
          </div>
        </div>
      )}

      {/* Error Alert */}
      {error && (
        <div className="alert alert-error mb-6">
          <svg
            className="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{error}</span>
          <div>
            <button className="btn btn-sm btn-outline" onClick={handleRefresh}>
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* Table Card */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="card-title">
            <h2 className="text-xl font-semibold">Regions Data</h2>
          </div>
          <RegionTable regions={regions} loading={loading} />
        </div>
      </div>
    </div>
  );
};

export default Regions;
