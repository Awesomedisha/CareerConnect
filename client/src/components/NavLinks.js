import React from 'react';
import { NavLink } from 'react-router-dom';
import links from '../utils/links';
import { useAppContext } from '../context/appContext';

export default function NavLinks({ toggleSidebar }) {
  const { user } = useAppContext();

  return (
    <div className='nav-links'>
      {links.map((link) => {
        const { text, path, id, icon, role } = link;
        const userRole = user?.role || 'seeker';

        if (role && user && userRole !== role) {
          return null;
        }

        return (
          <NavLink
            to={path}
            key={id}
            onClick={toggleSidebar}
            className={({ isActive }) =>
              isActive ? 'nav-link active' : 'nav-link'
            }
            end
          >
            <span className='icon'>{icon}</span>
            {text}
          </NavLink>
        );
      })}
    </div>
  );
};
