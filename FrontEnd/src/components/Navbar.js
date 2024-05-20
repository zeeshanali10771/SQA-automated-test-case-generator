import React from 'react';
import { AppBar, Toolbar, Typography } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import '../styles/Navbar.css';

const Navbar = () => {
    const location = useLocation();
    let title = 'Code Coverage Tool';

    return (
        <AppBar position="static" className="navbar" sx={{ height: '10vh' }}>
            <Toolbar className="navbar-toolbar">
                <Typography variant="h6" component={Link} to="/" className="navbar-title">
                    {title}
                </Typography>
                {location.pathname.includes('coverage-selection') && (
                    <Typography variant="h6" className="navbar-link">
                        <Link to="/coverage"> Coverage</Link>
                    </Typography>
                )}
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;