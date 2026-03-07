import React, { useState } from 'react';
import moment from 'moment';
import { FaLocationArrow, FaBriefcase, FaCalendarAlt } from 'react-icons/fa';
import { useAppContext } from '../context/appContext';
import Wrapper from '../assets/wrappers/Job';
import JobInfo from './JobInfo';

export default function HRJob({
    _id,
    position,
    company,
    jobLocation,
    jobType,
    createdAt,
    isPublic,
}) {
    const { getApplications, hrApplications } = useAppContext();
    const [showApplicants, setShowApplicants] = useState(false);

    let date = moment(createdAt);
    date = date.format('MMM Do, YYYY');

    const handleViewApplicants = () => {
        if (!showApplicants) {
            getApplications('hrApplications', _id);
        }
        setShowApplicants(!showApplicants);
    };

    return (
        <Wrapper>
            <header>
                <div className="main-icon">{company.charAt(0)}</div>
                <div className="info">
                    <h5>{position}</h5>
                    <p>{company}</p>
                </div>
            </header>
            <div className="content">
                <div className="content-center">
                    <JobInfo icon={<FaLocationArrow />} text={jobLocation} />
                    <JobInfo icon={<FaCalendarAlt />} text={date} />
                    <JobInfo icon={<FaBriefcase />} text={jobType} />
                    <div className={`status ${isPublic ? 'interview' : 'pending'}`}>
                        {isPublic ? 'Public' : 'Private'}
                    </div>
                </div>
                <footer>
                    <div className="actions">
                        <button
                            type='button'
                            className='btn edit-btn'
                            onClick={handleViewApplicants}
                        >
                            {showApplicants ? 'Hide Applicants' : 'View Applicants'}
                        </button>
                    </div>
                </footer>
                {showApplicants && (
                    <div style={{ marginTop: '1rem', padding: '1rem', background: '#f0f4f8', borderRadius: '4px' }}>
                        <h6>Applicants:</h6>
                        {hrApplications && hrApplications.length > 0 ? (
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                {hrApplications.map((app) => (
                                    <li key={app._id} style={{ marginBottom: '0.5rem', borderBottom: '1px solid #ccc', paddingBottom: '0.5rem' }}>
                                        <strong>{app.user.name}</strong> ({app.user.email})<br />
                                        Location: {app.user.location}<br />
                                        Status: {app.status}<br />
                                        {app.aiFitScore > 0 && (
                                            <div style={{ marginTop: '0.25rem', color: app.aiFitScore >= 70 ? '#2d6a4f' : '#85182a' }}>
                                                <strong>AI Fit Score: {app.aiFitScore}%</strong><br />
                                                <em>{app.aiFeedback}</em>
                                            </div>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No applicants yet.</p>
                        )}
                    </div>
                )}
            </div>
        </Wrapper>
    );
}
