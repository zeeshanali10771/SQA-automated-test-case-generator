import React, { useEffect, useState } from 'react';
import BarGraph from '../components/BarGraph.js';
import CoverageTable from '../components/CoverageTable.js';
import PercCoverages from '../components/PercCoverages.js';
import LineCoverage from '../components/LineCoverage.js';
import { Button } from '@mui/material';
import html2pdf from 'html2pdf.js';
import '../styles/CoveragesPage.css'

const CoveragesPage = () => {
    const [data, setData] = useState([]);
    useEffect(() => {
        const coverages = JSON.parse(localStorage.getItem('coverages'));
        const tempData = coverages.map(coverage => ({
            name: coverage.type.charAt(0).toUpperCase() + coverage.type.slice(1),
            percentage: coverage.coverage
        }));
        tempData.push({
            name: 'Functional',
            percentage: 100
        });
        console.log(tempData);
        setData(tempData);
    }, []);

    const exportPDF =async () => {
        const element = document.querySelector('.coverage');
        //remove button from pdf
        element.querySelector('.exp-btn').setAttribute('style', 'display: none');
        const opt = {
            margin: 1,
            filename: 'CoverageReport.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'Tabloid', orientation: 'landscape' }
        };
        await html2pdf().from(element).set(opt).save();
        //add button back
        element.querySelector('.exp-btn').setAttribute('style', 'display: block');
        
    };

    return (
        <>
            <div className="coverage">
                <div className='heading'>
                    <h1>Coverage Report</h1>
                    <Button className='exp-btn' onClick={exportPDF}>Export PDF</Button>
                </div>
                <div className='top'>
                    <BarGraph data={data} />
                    <CoverageTable data={data} />
                </div>
                <LineCoverage />
            </div>
        </>
    );
};

export default CoveragesPage;