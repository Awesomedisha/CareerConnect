import React from 'react';
import Wrapper from '../assets/wrappers/NotificationCenter';
import moment from 'moment';

const NotificationCenter = ({ notifications, onClose }) => {
    return (
        <Wrapper>
            <h4>Notifications</h4>
            {notifications.length === 0 ? (
                <div className="no-notifications">No new notifications</div>
            ) : (
                notifications.map((notif, index) => (
                    <div key={index} className="notification-item">
                        <p>
                            Your application for <strong>{notif.position}</strong> is now
                            <span className={`status-badge ${notif.status}`}>{notif.status}</span>
                        </p>
                        <div className="time">{moment(notif.updatedAt).fromNow()}</div>
                    </div>
                ))
            )}
        </Wrapper>
    );
};

export default NotificationCenter;
