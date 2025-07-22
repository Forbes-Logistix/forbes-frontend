import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Step1PersonalInfo from './steps/Step1PersonalInfo';
import Step2AddressHistory from './steps/Step2AddressHistory';
import Step3DOTMedical from './steps/Step3DOTMedical';
//import Step4EmploymentHistory from './steps/Step4EmploymentHistory';
import Step5DrivingExperience from './steps/Step5DrivingExperience';
import Step6AccidentRecord from './steps/Step6AccidentRecord';
import Step7TrafficConvictions from './steps/Step7TrafficConvictions';
import Step8LicenseHistory from './steps/Step8LicenseHistory';
import Step9Disclosures from './steps/Step9Disclosures';
import Step10References from './steps/Step10References';
import Step11Declaration from './steps/Step11Declaration';
import KineticImage from '../Assets/Kinetic-1.jpg';

const steps = [
  Step1PersonalInfo,
  Step2AddressHistory,
  Step3DOTMedical,
  //Step4EmploymentHistory,
  Step5DrivingExperience,
  Step6AccidentRecord,
  Step7TrafficConvictions,
  Step8LicenseHistory,
  Step9Disclosures,
  Step10References,
  Step11Declaration
];

const ApplyForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    currentAddress: { address: '', city: '', state: '', zip: '' },
    previousAddresses: [],
    medical: { isCurrent: false },
    currentEmployer: {
      from: '', to: '', employer: '', position: '', phone: '', address: '',
      reason: '', fmcsr: '', dotDrugTest: ''
    },
    previousEmployers: [],
    drivingExperience: {
      equipment: {
        straightTruckSelected: false,
        straightTruckFrom: '', straightTruckTo: '', straightTruckMileage: '',
        tractorSemiSelected: false, tractorSemiFrom: '', tractorSemiTo: '', tractorSemiMileage: '',
        tractorTwoSelected: false, tractorTwoFrom: '', tractorTwoTo: '', tractorTwoMileage: '',
        tractorTripleSelected: false, tractorTripleFrom: '', tractorTripleTo: '', tractorTripleMileage: ''
      },
      statesOperated: '', courses: [], awards: []
    },
    accidentRecords: [],
    trafficConvictions: [],
    disclosures: [],
    licenseHistory: [],
    references: [],
    declaration: { signature: '', date: '' }
  });

  const [currentStep, setCurrentStep] = useState(0);
  const StepComponent = steps[currentStep];

  const next = () => setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  const back = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

  const updateFormData = (newData) => {
    setFormData((prev) => ({ ...prev, ...newData }));
  };

  // const handleSubmit = async () => {
  //   try {
  //     const response = await fetch(`${process.env.REACT_APP_API_URL}/api/send-pdf`, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify(formData),
  //     });
  
  //     if (!response.ok) {
  //       throw new Error('Failed to send PDF');
  //     }
  
  //     const data = await response.json();
  //     console.log('Success:', data);
  //     navigate('/success'); // or your preferred redirect
  //   } catch (error) {
  //     console.error('Error:', error);
  //     alert('Submission failed. Please try again.');
  //   }
  // };

const handleSubmit = async () => {
  try {
    const cleanData = {
      ...formData,
      previousAddresses: Array.isArray(formData.previousAddresses) ? formData.previousAddresses : [],
      previousEmployers: Array.isArray(formData.previousEmployers) ? formData.previousEmployers : [],
      accidentRecords: Array.isArray(formData.accidentRecords) ? formData.accidentRecords : [],
      trafficConvictions: Array.isArray(formData.trafficConvictions) ? formData.trafficConvictions : [],
      disclosures: Array.isArray(formData.disclosures) ? formData.disclosures : [],
      licenseHistory: Array.isArray(formData.licenseHistory) ? formData.licenseHistory : [],
      references: Array.isArray(formData.references) ? formData.references : [],
      drivingExperience: {
        ...formData.drivingExperience,
        courses: Array.isArray(formData.drivingExperience.courses) ? formData.drivingExperience.courses : [],
        awards: Array.isArray(formData.drivingExperience.awards) ? formData.drivingExperience.awards : [],
      }
    };

    console.log("Final payload:", cleanData);

    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/send-pdf`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(cleanData),
    });

    if (!response.ok) {
      throw new Error('Failed to send PDF');
    }

    const data = await response.json();
    console.log('Success:', data);
    navigate('/success');
  } catch (error) {
    console.error('Error:', error);
    alert('Submission failed. Please try again.');
  }
};


  useEffect(() => {
    const saved = localStorage.getItem('driverApplicationData');
    if (saved) setFormData(JSON.parse(saved));
  }, []);

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat pt-36 pb-36 px-4"
      style={{
        backgroundImage: `linear-gradient(rgba(74, 44, 42, 0.85), rgba(74, 44, 42, 0.85)), url(${KineticImage})`,
        backgroundBlendMode: "multiply"
      }}
    >
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-2xl border border-gray-200">
        <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-2">
          Forbes Logistix Driver Application
        </h2>
        <p className="text-center text-gray-500 mb-6">Step {currentStep + 1} of {steps.length}</p>
        <div className="border-t border-gray-200 pt-6">
          <StepComponent data={formData} updateData={updateFormData} />
        </div>

        <div className="flex justify-between items-center mt-10">
          {currentStep > 0 && (
            <button
              onClick={back}
              className="px-5 py-2.5 rounded-xl bg-gray-200 hover:bg-gray-300 transition text-gray-700 font-medium"
            >
              ← Back
            </button>
          )}
          {currentStep < steps.length - 1 ? (
            <button
              onClick={next}
              className="ml-auto px-6 py-2.5 bg-[#222] text-white rounded-xl hover:bg-[#333] transition"
            >
              Next →
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="ml-auto px-6 py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 transition"
            >
              Submit
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApplyForm;