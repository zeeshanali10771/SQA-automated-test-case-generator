import React, { useState } from 'react';
import { Button, Paper, Typography } from '@mui/material';
import { useDropzone } from 'react-dropzone';
import { useNavigate } from 'react-router-dom/dist';
import '../styles/Home.css';

const FileUploadPage = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const fetchAllData = () => {
        const formData = new FormData();
        formData.append('file', selectedFile);

        setIsLoading(true);
        console.log("File sending")
        fetch('http://127.0.0.1:3000/coverage', {
            method: 'POST',
            body: formData,
        }).then((response) => response.json())
            .then((data) => {
                console.log(data);
                localStorage.setItem('coverages', JSON.stringify(data));
                setIsLoading(false);
                navigate('/coverages');
            })
            .catch((error) => {
                console.error('Error:', error);
                setIsLoading(false);
            });
    }

    const onDrop = (acceptedFiles) => {
        // Handle the dropped file
        const file = acceptedFiles[0];
        setSelectedFile(file);
    };

    const removeFile = () => {
        // Remove the selected file
        setSelectedFile(null);
    };

    const handleNext = () => {
        fetchAllData();
    };

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: '.js,.ts,.jsx',
    });

    return (
        <div className="file-upload-page">
            {isLoading ? (
                <div className="loading-screen">Loading...</div>
            ) : (
                <>
                    <Paper
                        {...getRootProps()}
                        className={`dropzone ${selectedFile ? 'hidden' : ''}`}
                    >
                        <input {...getInputProps()} accept=".js,.ts,.jsx" />
                        <Typography variant="h5">Drag & Drop a File Here</Typography>
                        <Button className='browse-btn' variant="contained" color="primary">
                            or Browse File
                        </Button>
                    </Paper>
                    {selectedFile && (
                        <div className="file-details">
                            <Typography variant="subtitle1">{selectedFile.name}</Typography>
                            <Button onClick={removeFile} color="secondary">
                                Remove
                            </Button>
                        </div>
                    )}
                    {selectedFile && (
                        <Button
                            className='next-btn'
                            variant="contained"
                            color="primary"
                            onClick={handleNext}
                        >
                            Next
                        </Button>
                    )}
                </>
            )}
        </div>
    );
};

export default FileUploadPage;
