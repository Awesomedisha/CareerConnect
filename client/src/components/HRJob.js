import React, { useState } from 'react';
import moment from 'moment';
import { FaLocationArrow, FaBriefcase, FaCalendarAlt, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { useAppContext } from '../context/appContext';
import Wrapper from '../assets/wrappers/Job';
import JobInfo from './JobInfo';
import FitScore from './FitScore';
import FitAnalysisCard from './FitAnalysisCard';

export default function HRJob({
    _id,
    position,
    company,
    jobLocation,
    jobType,
    createdAt,
    isPublic,
}) {
    const { getApplications } = useAppContext();
    const [showApplicants, setShowApplicants] = useState(false);
    const [expandedApp, setExpandedApp] = useState(null);
    const [localApplicants, setLocalApplicants] = useState([]);
    const [fetching, setFetching] = useState(false);

    let date = moment(createdAt);
    date = date.format('MMM Do, YYYY');

    const handleViewApplicants = async () => {
        if (!showApplicants) {
            setFetching(true);
            const apps = await getApplications('hrApplications', _id);
            setLocalApplicants(apps || []);
            setFetching(false);
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
                        {fetching ? (
                            <p>Loading applicants...</p>
                        ) : localApplicants && localApplicants.length > 0 ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {localApplicants.map((app) => (
                                    <div key={app._id} style={{ background: 'white', padding: '1rem', borderRadius: 'var(--borderRadius)', border: '1px solid var(--grey-100)' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div>
                                                <strong>{app.user.name}</strong> ({app.user.email})<br />
                                                <small style={{ color: 'var(--grey-500)' }}>Location: {app.user.location} | Status: {app.status}</small>
                                            </div>
                                            <div style={{ transform: 'scale(0.8)' }}>
                                                <FitScore score={app.aiFitScore} />
                                            </div>
                                        </div>

                                        <button
                                            className="btn"
                                            style={{ marginTop: '0.5rem', fontSize: '0.8rem', padding: '0.25rem 0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                                            onClick={() => setExpandedApp(expandedApp === app._id ? null : app._id)}
                                        >
                                            {expandedApp === app._id ? <FaChevronUp /> : <FaChevronDown />}
                                            {expandedApp === app._id ? 'Hide Fit Analysis' : 'Show Fit Analysis'}
                                        </button>

                                        {expandedApp === app._id && (
                                            <FitAnalysisCard
                                                technicalFit={app.technicalFit}
                                                softSkillsFit={app.softSkillsFit}
                                                experienceFit={app.experienceFit}
                                                aiFeedback={app.aiFeedback}
                                                aiGapAnalysis={app.aiGapAnalysis}
                                                aiUpskillingSuggestions={app.aiUpskillingSuggestions}
                                            />
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p>No applicants yet.</p>
                        )}
                    </div>
                )}
            </div>
        </Wrapper>
    );
}
