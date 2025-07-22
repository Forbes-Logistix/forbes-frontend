// import React from 'react';

// const Step8LicenseHistory = ({ data, updateData }) => {
//   const handleChange = (index, field, value) => {
//     const history = [...data.licenseHistory];
//     history[index] = { ...history[index], [field]: value };
//     updateData({ licenseHistory: history });
//   };

//   const addLicense = () => {
//     updateData({ 
//       licenseHistory: [
//         ...data.licenseHistory,
//         {
//           hasLicense: true,
//           state: '',
//           type: '',
//           endorsements: '',
//           expiration: ''
//         }
//       ]
//     });
//   };

//   const removeLicense = (index) => {
//     const history = [...data.licenseHistory];
//     history.splice(index, 1);
//     updateData({ licenseHistory: history });
//   };

//   return (
//     <div className="form-section brown p-8 rounded-3xl shadow-xl animate-fade-in duration-700">
//       <h3 className="form-section-title text-2xl font-bold mb-6">
//         Step 7: Driver's License History (Last 3 Years)
//       </h3>

//       {data.licenseHistory.map((license, index) => (
//         <div key={index} className="bg-white p-6 rounded-xl shadow-md border border-amber-200 mb-6">
//           <div className="flex justify-between items-center mb-4">
//             <h4 className="text-brown-800 font-semibold">License #{index + 1}</h4>
//             <button
//               onClick={() => removeLicense(index)}
//               className="text-red-600 hover:text-red-800 transition-colors text-sm"
//             >
//               Remove
//             </button>
//           </div>

          

//           {/* License Details */}
//           {license.hasLicense && (
//             <div className="grid grid-cols-1 gap-6">
//               <div>
//                 <label className="form-label brown mb-1">State</label>
//                 <input
//                   type="text"
//                   className="input brown w-full"
//                   value={license.state}
//                   onChange={(e) => handleChange(index, 'state', e.target.value)}
//                 />
//               </div>
//               <div>
//                 <label className="form-label brown mb-1">License Type</label>
//                 <input
//                   type="text"
//                   className="input brown w-full"
//                   value={license.type}
//                   onChange={(e) => handleChange(index, 'type', e.target.value)}
//                 />
//               </div>
//               <div>
//                 <label className="form-label brown mb-1">Endorsements</label>
//                 <input
//                   type="text"
//                   className="input brown w-full"
//                   value={license.endorsements}
//                   onChange={(e) => handleChange(index, 'endorsements', e.target.value)}
//                 />
//               </div>
//               <div>
//                 <label className="form-label brown mb-1">Expiration Date</label>
//                 <input
//                   type="date"
//                   className="input brown w-full"
//                   value={license.expiration}
//                   onChange={(e) => handleChange(index, 'expiration', e.target.value)}
//                 />
//               </div>
//             </div>
//           )}
//         </div>
//       ))}

//       <button
//         onClick={addLicense}
//         className="w-full px-6 py-3 bg-brown-700 text-white rounded-xl text-sm hover:bg-brown-800 transition-all shadow-lg flex items-center justify-center gap-2"
//       >
//         <span className="text-xl">+</span> Add License
//       </button>
//     </div>
//   );
// };

// export default Step8LicenseHistory;


import React from 'react';

const Step8LicenseHistory = ({ data, updateData }) => {
  const handleChange = (index, field, value) => {
    const history = [...(data.licenseHistory ?? [])];
    history[index] = { ...history[index], [field]: value };
    updateData({ licenseHistory: history });
  };

  const addLicense = () => {
    updateData({ 
      licenseHistory: [
        ...(data.licenseHistory ?? []),
        {
          hasLicense: true,
          state: '',
          type: '',
          endorsements: '',
          expiration: ''
        }
      ]
    });
  };

  const removeLicense = (index) => {
    const history = [...(data.licenseHistory ?? [])];
    history.splice(index, 1);
    updateData({ licenseHistory: history });
  };

  return (
    <div className="form-section brown p-8 rounded-3xl shadow-xl animate-fade-in duration-700">
      <h3 className="form-section-title text-2xl font-bold mb-6">
        Step 7: Driver's License History (Last 3 Years)
      </h3>

      {(data.licenseHistory ?? []).map((license, index) => (
        <div key={index} className="bg-white p-6 rounded-xl shadow-md border border-amber-200 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-brown-800 font-semibold">License #{index + 1}</h4>
            <button
              onClick={() => removeLicense(index)}
              className="text-red-600 hover:text-red-800 transition-colors text-sm"
            >
              Remove
            </button>
          </div>

          {/* License Details */}
          {license.hasLicense && (
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="form-label brown mb-1">State</label>
                <input
                  type="text"
                  className="input brown w-full"
                  value={license.state}
                  onChange={(e) => handleChange(index, 'state', e.target.value)}
                />
              </div>
              <div>
                <label className="form-label brown mb-1">License Type</label>
                <input
                  type="text"
                  className="input brown w-full"
                  value={license.type}
                  onChange={(e) => handleChange(index, 'type', e.target.value)}
                />
              </div>
              <div>
                <label className="form-label brown mb-1">Endorsements</label>
                <input
                  type="text"
                  className="input brown w-full"
                  value={license.endorsements}
                  onChange={(e) => handleChange(index, 'endorsements', e.target.value)}
                />
              </div>
              <div>
                <label className="form-label brown mb-1">Expiration Date</label>
                <input
                  type="date"
                  className="input brown w-full"
                  value={license.expiration}
                  onChange={(e) => handleChange(index, 'expiration', e.target.value)}
                />
              </div>
            </div>
          )}
        </div>
      ))}

      <button
        onClick={addLicense}
        className="w-full px-6 py-3 bg-brown-700 text-white rounded-xl text-sm hover:bg-brown-800 transition-all shadow-lg flex items-center justify-center gap-2"
      >
        <span className="text-xl">+</span> Add License
      </button>
    </div>
  );
};

export default Step8LicenseHistory;
