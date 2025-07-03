import React from 'react';

const Step1PersonalInfo = ({ data, updateData }) => {
  const handleChange = (e) => {
    updateData({ [e.target.name]: e.target.value });
  };

  return (
    <div className="form-section">
      <h3 className="form-section-title text-2xl font-bold mb-6">Step 1: Personal Information</h3>
      <div className="form-grid">
        <div>
          <label className="form-label">Application Date</label>
          <input
            type="date"
            name="applicationDate"
            value={data.applicationDate || ''}
            onChange={handleChange}
            className="input"
          />
        </div>

        <div>
          <label className="form-label">Full Name</label>
          <input
            type="text"
            name="name"
            value={data.name || ''}
            onChange={handleChange}
            placeholder="John Doe"
            className="input"
          />
        </div>

       

        <div>
          <label className="form-label">Phone Number</label>
          <input
            type="tel"
            name="phone"
            value={data.phone || ''}
            onChange={handleChange}
            placeholder="(123) 456-7890"
            className="input"
          />
        </div>

        <div>
          <label className="form-label">Date of Birth</label>
          <input
            type="date"
            name="dob"
            value={data.dob || ''}
            onChange={handleChange}
            className="input"
          />
        </div>

        <div>
          <label className="form-label">Email Address</label>
          <input
            type="email"
            name="email"
            value={data.email || ''}
            onChange={handleChange}
            placeholder="example@email.com"
            className="input"
          />
        </div>
      </div>
    </div>
  );
};

export default Step1PersonalInfo;