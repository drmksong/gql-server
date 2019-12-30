import React from 'react';
import {NavLink} from 'react-router-dom';

import './MainNavigation.css';

const mainNavigation = props => (
    <header className="main-navigation">
        <div className="main-navigation-logo">
            <h1>EasyEvent</h1>
        </div>
        <nav className="main-navigation-items">
            <ul>
                <li>
                    <NavLink to="/auth">Authentificate</NavLink>
                </li>
                <li>
                    <NavLink to="/events">Events</NavLink>
                </li>
                <li>
                    <NavLink to="/bookings">Bookings</NavLink>
                </li>
            </ul>
        </nav>
    </header>
    );

export default mainNavigation;