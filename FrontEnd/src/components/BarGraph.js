import React from 'react';
import { BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar } from 'recharts';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

const BarGraph = ({ data }) => {
    return (
        <Card style={{ boxShadow: '0 3px 5px 2px rgba(0, 0, 0, .3)' }}>
          <CardContent>
            <BarChart width={1100} height={428} data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="percentage" fill="#89CFF0" />
            </BarChart>
          </CardContent>
        </Card>
    );
};

export default BarGraph;