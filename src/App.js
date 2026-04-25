import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Home from './Pages/Home';
import AboutUs from './Pages/AboutUs';
import Operations from './Pages/Operations.js';
import Careers from './Pages/Careers.js';
import Navbar from './Components/Navbar/Navbar';
import ContactPage from './Pages/ContactPage.js';
import ApplyForm from './Components/ApplyForm/ApplyForm.js';
import Footer from './Components/Footer/Footer.js';
import Success from './Components/ApplyForm/Success';
import './index.css';
import './Components/ApplyForm/formStyles.css';

function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/aboutUs" element={<AboutUs />} />
          <Route path="/operations" element={<Operations />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/contactUs" element={<ContactPage />} />
          <Route path="/apply" element={<ApplyForm />} />
          <Route path="/success" element={<Success />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;