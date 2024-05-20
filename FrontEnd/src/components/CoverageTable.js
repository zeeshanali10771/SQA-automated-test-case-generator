import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import Card from '@mui/material/Card';
import {CardContent} from '@mui/material';

const CoverageTable = ({ data }) => {
    return (
        <Card style={{ height: '469px' , boxShadow: '0 3px 5px 2px rgba(0, 0, 0, .3)'}}>
            <CardContent>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Coverage Type</TableCell>
                                <TableCell align="right">Percentage</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data.map((row) => (
                                <TableRow key={row.name}>
                                    <TableCell component="th" scope="row">
                                        {row.name}
                                    </TableCell>
                                    <TableCell align="right">{row.percentage}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </CardContent>
        </Card>
    );
};

export default CoverageTable;