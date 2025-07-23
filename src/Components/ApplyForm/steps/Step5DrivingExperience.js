import React from 'react';

const Step5DrivingExperience = ({ data, updateData }) => {
  const handleChange = (type, field, value) => {
    if (type === 'current') {
      updateData({ currentEmployer: { ...data.currentEmployer, [field]: value } });
    } else {
      const previousEmployers = [...data.previousEmployers];
      previousEmployers[type] = { ...previousEmployers[type], [field]: value };
      updateData({ previousEmployers });
    }
  };

  const addPreviousEmployer = () => {
    updateData({ previousEmployers: [...data.previousEmployers, {}] });
  };

  const removePreviousEmployer = (index) => {
    const previousEmployers = [...data.previousEmployers];
    previousEmployers.splice(index, 1);
    updateData({ previousEmployers });
  };

  return (
    <div className="form-section brown space-y-10">
      <h3 className="form-section-title text-2xl font-bold mb-6">Step 4: Employment History (Last 10 Years)</h3>

      {/* Current Employer */}
      <div className="space-y-6 border rounded-2xl p-6 shadow-md bg-white">
        <h4 className="text-lg font-semibold text-brown-700">Current Employer</h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="form-label brown">Employer Name</label>
            <input type="text" className="input brown" value={data.currentEmployer?.employer || ''} onChange={(e) => handleChange('current', 'employer', e.target.value)} required />
          </div>
          
          <div>
            <label className="form-label brown">Position Held</label>
            <input type="text" className="input brown" value={data.currentEmployer?.position || ''} onChange={(e) => handleChange('current', 'position', e.target.value)} required />
          </div>
          <div>
            <label className="form-label brown">From</label>
            <input type="text" className="input brown" value={data.currentEmployer?.from || ''} onChange={(e) => handleChange('current', 'from', e.target.value)} required />
          </div>
          <div>
            <label className="form-label brown">To</label>
            <input type="text" className="input brown" value={data.currentEmployer?.to || ''} onChange={(e) => handleChange('current', 'to', e.target.value)} required />
          </div>
          <div>
            <label className="form-label brown">Employer Phone</label>
            <input type="tel" className="input brown" value={data.currentEmployer?.phone || ''} onChange={(e) => handleChange('current', 'phone', e.target.value)} required />
          </div>
          <div className="md:col-span-2">
            <label className="form-label brown">Employer Address</label>
            <input type="text" className="input brown" value={data.currentEmployer?.address || ''} onChange={(e) => handleChange('current', 'address', e.target.value)} required />
          </div>
          <div className="md:col-span-2">
            <label className="form-label brown">Reason for Leaving</label>
            <input type="text" className="input brown" value={data.currentEmployer?.reason || ''} onChange={(e) => handleChange('current', 'reason', e.target.value)} />
          </div>
        </div>

        {/* FMCSRs Question */}
        <div className="py-4">
          <label className="form-label brown">
            Subject to FMCSRs (Federal Motor Carrier Safety Regulations)?
          </label>
          <select
            className="input brown"
            value={data.currentEmployer?.fmcsr || ''}
            onChange={(e) => handleChange('current', 'fmcsr', e.target.value)}
          >
            <option value="">Select</option>
            <option value="Y">Yes</option>
            <option value="N">No</option>
          </select>
        </div>

        {/* DOT Drug/Alcohol Testing */}
        <div className="py-4">
          <label className="form-label brown">DOT Drug/Alcohol Testing?</label>
          <select
            className="input brown"
            value={data.currentEmployer?.dotDrugTest || ''}
            onChange={(e) => handleChange('current', 'dotDrugTest', e.target.value)}
          >
            <option value="">Select</option>
            <option value="Y">Yes</option>
            <option value="N">No</option>
          </select>
        </div>
      </div>

      {/* Previous Employers */}
      <div className="space-y-8">
        {data.previousEmployers.map((employer, index) => (
          <div key={index} className="border rounded-2xl p-6 shadow bg-gray-50">
            <div className="mt-4">
              <button
                onClick={() => removePreviousEmployer(index)}
                className="text-red-600 hover:text-red-800 text-sm float-right"
              >
                Remove
              </button>
            </div>
            <h4 className="text-md font-semibold mb-4 text-brown-700">Previous Employer {index + 1}</h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="form-label brown">Employer Name</label>
                <input type="text" className="input brown" value={employer.employer || ''} onChange={(e) => handleChange(index, 'employer', e.target.value)} />
              </div>
              <div>
                <label className="form-label brown">Position Held</label>
                <input type="text" className="input brown" value={employer.position || ''} onChange={(e) => handleChange(index, 'position', e.target.value)} />
              </div>
              <div>
                <label className="form-label brown">From</label>
                <input type="text" className="input brown" value={employer.from || ''} onChange={(e) => handleChange(index, 'from', e.target.value)} />
              </div>
              <div>
                <label className="form-label brown">To</label>
                <input type="text" className="input brown" value={employer.to || ''} onChange={(e) => handleChange(index, 'to', e.target.value)} />
              </div>
              <div>
                <label className="form-label brown">Employer Phone</label>
                <input type="tel" className="input brown" value={employer.phone || ''} onChange={(e) => handleChange(index, 'phone', e.target.value)} />
              </div>
              <div className="md:col-span-2">
                <label className="form-label brown">Employer Address</label>
                <input type="text" className="input brown" value={employer.address || ''} onChange={(e) => handleChange(index, 'address', e.target.value)} />
              </div>
              <div className="md:col-span-2">
                <label className="form-label brown">Reason for Leaving</label>
                <input type="text" className="input brown" value={employer.reason || ''} onChange={(e) => handleChange(index, 'reason', e.target.value)} />
              </div>
            </div>

            {/* FMCSRs Question */}
            <div className="py-4">
              <label className="form-label brown">
                Subject to FMCSRs (Federal Motor Carrier Safety Regulations)?
              </label>
              <select
                className="input brown"
                value={employer.fmcsr || ''}
                onChange={(e) => handleChange(index, 'fmcsr', e.target.value)}
              >
                <option value="">Select</option>
                <option value="Y">Yes</option>
                <option value="N">No</option>
              </select>
            </div>

            {/* DOT Drug/Alcohol Testing */}
            <div className="py-4">
              <label className="form-label brown">DOT Drug/Alcohol Testing?</label>
              <select
                className="input brown"
                value={employer.dotDrugTest || ''}
                onChange={(e) => handleChange(index, 'dotDrugTest', e.target.value)}
              >
                <option value="">Select</option>
                <option value="Y">Yes</option>
                <option value="N">No</option>
              </select>
            </div>
          </div>
        ))}

        <button
          onClick={addPreviousEmployer}
          className="w-full px-6 py-3 bg-brown-700 text-white rounded-xl text-sm hover:bg-brown-800 transition-all shadow-lg flex items-center justify-center gap-2"
        >
          + Add Previous Employer
        </button>
      </div>
    </div>
  );
};

export default Step5DrivingExperience;