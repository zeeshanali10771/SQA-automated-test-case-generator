import React, { useEffect, useState } from 'react';
import Card from '@mui/material/Card';
import { CardContent } from '@mui/material';

const LineCoverage = () => {
    const [divContent, setDivContent] = useState('');

    useEffect(() => {
        fetch('http://127.0.0.1:3000/getLcov',
            {
                method: 'GET',

            }).then((response) => response.text())
            .then((data) => {
                const parser = new DOMParser();
                const htmlDocument = parser.parseFromString(data, 'text/html');
                const div = htmlDocument.querySelector('table.coverage');
                if (div) {
                    setDivContent(div.outerHTML);
                } else {
                    console.error('Element with selector "table.coverage" not found');
                }
            });
    }, []);

    return (
        <Card style={{ boxShadow: '0 3px 5px 2px rgba(0, 0, 0, .3)' }}>
            <CardContent style={{ display: 'block' }}>
                <pre>
                <div className="line-cov" dangerouslySetInnerHTML={{ __html: divContent }} />
                </pre>
            </CardContent>
        </Card>
    );
};

export default LineCoverage;