import React, { useState } from 'react';
import FileUploadPage from '../components/FileUploadPage';
import "../styles/Home.css";

const HomePage = () => {
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <div className="homepage-container">   
        <FileUploadPage />
    </div>
  );
};

export default HomePage;
