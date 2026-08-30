import React, { useState } from 'react';

export default function EventFilter({ onFilter, onReset }) {
  const [filters, setFilters] = useState({
    searchTerm: '',
    category: '',
    dateFrom: '',
    dateTo: '',
    capacity: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFilter = () => {
    onFilter(filters);
  };

  const handleReset = () => {
    setFilters({
      searchTerm: '',
      category: '',
      dateFrom: '',
      dateTo: '',
      capacity: ''
    });
    onReset();
  };

  return (
    <div className="card border-0 shadow-lg mb-4">
      <div className="card-header bg-gradient-primary" style={{ background: 'linear-gradient(90deg, #6366f1 0%, #818cf8 100%)' }}>
        <h5 className="text-white mb-0">
          <i className="bi bi-funnel me-2"></i>Advanced Filters
        </h5>
      </div>

      <div className="card-body">
        <div className="row g-3">
          {/* Search Term */}
          <div className="col-md-6 col-lg-3">
            <label className="form-label">
              <i className="bi bi-search me-1"></i>Event Name
            </label>
            <input 
              type="text"
              className="form-control"
              name="searchTerm"
              placeholder="Search events..."
              value={filters.searchTerm}
              onChange={handleChange}
            />
          </div>

          {/* Category */}
          <div className="col-md-6 col-lg-3">
            <label className="form-label">
              <i className="bi bi-tag me-1"></i>Category
            </label>
            <select 
              className="form-select"
              name="category"
              value={filters.category}
              onChange={handleChange}
            >
              <option value="">All Categories</option>
              <option value="Tech">Tech</option>
              <option value="Sports">Sports</option>
              <option value="Cultural">Cultural</option>
              <option value="Academic">Academic</option>
              <option value="Social">Social</option>
              <option value="Workshop">Workshop</option>
            </select>
          </div>

          {/* Date From */}
          <div className="col-md-6 col-lg-2">
            <label className="form-label">
              <i className="bi bi-calendar-range me-1"></i>From Date
            </label>
            <input 
              type="date"
              className="form-control"
              name="dateFrom"
              value={filters.dateFrom}
              onChange={handleChange}
            />
          </div>

          {/* Date To */}
          <div className="col-md-6 col-lg-2">
            <label className="form-label">
              <i className="bi bi-calendar-check me-1"></i>To Date
            </label>
            <input 
              type="date"
              className="form-control"
              name="dateTo"
              value={filters.dateTo}
              onChange={handleChange}
            />
          </div>

          {/* Min Capacity */}
          <div className="col-md-6 col-lg-2">
            <label className="form-label">
              <i className="bi bi-people me-1"></i>Min Capacity
            </label>
            <input 
              type="number"
              className="form-control"
              name="capacity"
              placeholder="Min capacity"
              value={filters.capacity}
              onChange={handleChange}
              min="0"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="row mt-4">
          <div className="col-auto">
            <button 
              className="btn btn-primary"
              onClick={handleFilter}
            >
              <i className="bi bi-search me-2"></i>Apply Filters
            </button>
          </div>
          <div className="col-auto">
            <button 
              className="btn btn-outline-secondary"
              onClick={handleReset}
            >
              <i className="bi bi-arrow-clockwise me-2"></i>Reset Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
