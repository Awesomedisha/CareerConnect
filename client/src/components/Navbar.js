import React from 'react';
import Wrapper from '../assets/wrappers/Navbar.js';
import { FaAlignLeft, FaUserCircle, FaCaretDown, FaBell } from 'react-icons/fa';
import { useAppContext } from '../context/appContext.js';
import Logo from './Logo';
import NotificationCenter from './NotificationCenter';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const { toggleSidebar, logoutUser, user, userApplications, getApplications } = useAppContext();
  const [showLogout, setShowLogout] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const userRole = user?.role || 'seeker';
    if (userRole === 'seeker') {
      getApplications('userApplications');
    }
  }, []);

  const recentNotifications = userApplications
    .filter(app => app.status !== 'pending')
    .map(app => ({
      position: app.job?.position || 'Job',
      status: app.status,
      updatedAt: app.updatedAt
    }))
    .slice(0, 5);

  return (
    <Wrapper>
      <div className="nav-center">
        <button
          className="toggle-btn"
          onClick={toggleSidebar}>
          <FaAlignLeft />
        </button>
        <div>
          <Logo />
          <h3 className="logo-text">Dashboard</h3>
        </div>
        <div className="btn-container" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          {(user?.role || 'seeker') === 'seeker' && (
            <div style={{ position: 'relative' }}>
              <button
                type="button"
                className="btn"
                onClick={() => setShowNotifications(!showNotifications)}
                style={{ padding: '0.5rem', background: 'transparent', color: 'var(--primary-500)', fontSize: '1.2rem' }}
              >
                <FaBell />
                {recentNotifications.length > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: '-5px',
                    right: '-5px',
                    background: 'var(--red-dark)',
                    color: 'white',
                    borderRadius: '50%',
                    padding: '2px 5px',
                    fontSize: '0.6rem'
                  }}>
                    {recentNotifications.length}
                  </span>
                )}
              </button>
              {showNotifications && (
                <NotificationCenter
                  notifications={recentNotifications}
                  onClose={() => setShowNotifications(false)}
                />
              )}
            </div>
          )}
          <div style={{ position: 'relative' }}>
            <button
              type="button"
              className="btn"
              onClick={() => setShowLogout(!showLogout)}
            >
              <FaUserCircle />
              {user?.name}
              <FaCaretDown />
            </button>
            <div className={showLogout ? "dropdown show-dropdown" : "dropdown"}>
              <button
                type="button"
                className="dropdown-btn"
                onClick={logoutUser}
              >
                logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </Wrapper>
  )
}
