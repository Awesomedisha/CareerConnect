import React, { useState } from 'react';
import moment from 'moment';
import { FaLocationArrow, FaBriefcase, FaCalendarAlt, FaRobot } from 'react-icons/fa';
import { useAppContext } from '../context/appContext';
import Wrapper from '../assets/wrappers/Job';
import JobInfo from './JobInfo';
import FitScore from './FitScore';

export default function PublicJob({
    _id,
    position,
    title,
    company,
    jobLocation,
    jobType,
    createdAt,
    salaryMin,
    salaryMax,
    currency,
    isFeatured,
    isUrgent,
    locationCity,
}) {
    const { applyToJob, userApplications, isLoading, getPredictedFit } = useAppContext();
    const [predictedFit, setPredictedFit] = useState(null);
    const [isPredicting, setIsPredicting] = useState(false);

    let date = moment(createdAt);
    date = date.format('MMM Do, YYYY');

    const alreadyApplied = userApplications.find((app) => app.job?._id === _id);

    const handlePredict = async () => {
        setIsPredicting(true);
        const fit = await getPredictedFit(_id);
        if (fit) {
            setPredictedFit(fit);
        }
        setIsPredicting(false);
    };

    return (
        <Wrapper>
            <header>
                <div className="main-icon">{company.charAt(0)}</div>
                <div className="info">
                    <h5>{title || position}</h5>
                    <p>{company}</p>
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
                        {isFeatured && <span className="status interview" style={{ fontSize: '0.7rem', height: '20px', width: 'auto', padding: '0 0.5rem' }}>Featured</span>}
                        {isUrgent && <span className="status declined" style={{ fontSize: '0.7rem', height: '20px', width: 'auto', padding: '0 0.5rem' }}>Urgent</span>}
                    </div>
                </div>
                {(predictedFit || isPredicting) && (
                    <div style={{ marginLeft: 'auto' }}>
                        <FitScore
                            score={predictedFit?.score || 0}
                            isLoading={isPredicting}
                            label="Match"
                        />
                    </div>
                )}
            </header>
            <div className="content">
                <div className="content-center">
                    <JobInfo icon={<FaLocationArrow />} text={locationCity ? `${locationCity}, ${jobLocation}` : jobLocation} />
                    <JobInfo icon={<FaCalendarAlt />} text={date} />
                    <JobInfo icon={<FaBriefcase />} text={jobType} />
                    {salaryMin > 0 && (
                        <JobInfo icon={<strong>$</strong>} text={`${currency} ${salaryMin.toLocaleString()} - ${salaryMax.toLocaleString()}`} />
                    )}
                </div>
                <footer>
                    <div className="actions">
                        {!alreadyApplied && !predictedFit && (
                            <button
                                type='button'
                                className='btn edit-btn'
                                style={{ marginRight: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                                disabled={isLoading || isPredicting}
                                onClick={handlePredict}
                            >
                                <FaRobot /> Predict Match
                            </button>
                        )}
                        <button
                            type='button'
                            className='btn'
                            style={{
                                background: alreadyApplied ? 'var(--grey-200)' : 'var(--primary-500)',
                                color: alreadyApplied ? 'var(--grey-500)' : 'var(--white)'
                            }}
                            disabled={isLoading || alreadyApplied}
                            onClick={() => applyToJob(_id)}
                        >
                            {alreadyApplied ? 'Applied' : 'Apply Now'}
                        </button>
                    </div>
                </footer>
            </div>
        </Wrapper>
    );
}
