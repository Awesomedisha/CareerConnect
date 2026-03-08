import React from 'react';
import moment from 'moment';
import { FaLocationArrow, FaBriefcase, FaCalendarAlt, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import Wrapper from '../assets/wrappers/Job';
import JobInfo from './JobInfo';
import FitScore from './FitScore';
import FitAnalysisCard from './FitAnalysisCard';
import { useState } from 'react';

const MyApplicationItem = ({
    job,
    status,
    createdAt,
    aiFitScore,
    technicalFit,
    softSkillsFit,
    experienceFit,
    aiFeedback,
    aiGapAnalysis,
    aiUpskillingSuggestions
}) => {
    const [showAnalysis, setShowAnalysis] = useState(false);

    let date = moment(createdAt);
    date = date.format('MMM Do, YYYY');

    return (
        <Wrapper>
            <header>
                <div className="main-icon">{job?.company?.charAt(0) || 'J'}</div>
                <div className="info">
                    <h5>{job?.position || 'Position N/A'}</h5>
                    <p>{job?.company || 'Company N/A'}</p>
                </div>
                <div style={{ marginLeft: 'auto' }}>
                    <FitScore score={aiFitScore} label="Fit" />
                </div>
            </header>
            <div className="content">
                <div className="content-center">
                    <JobInfo icon={<FaLocationArrow />} text={job?.jobLocation || 'N/A'} />
                    <JobInfo icon={<FaCalendarAlt />} text={date} />
                    <JobInfo icon={<FaBriefcase />} text={job?.jobType || 'N/A'} />
                    <div className={`status ${status}`}>{status}</div>
                </div>
                <footer>
                    <div className="actions">
                        <button
                            type='button'
                            className='btn edit-btn'
                            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                            onClick={() => setShowAnalysis(!showAnalysis)}
                        >
                            {showAnalysis ? <FaChevronUp /> : <FaChevronDown />}
                            {showAnalysis ? 'Hide AI Analysis' : 'Show AI Analysis'}
                        </button>
                    </div>
                    {showAnalysis && (
                        <FitAnalysisCard
                            technicalFit={technicalFit}
                            softSkillsFit={softSkillsFit}
                            experienceFit={experienceFit}
                            aiFeedback={aiFeedback}
                            aiGapAnalysis={aiGapAnalysis}
                            aiUpskillingSuggestions={aiUpskillingSuggestions}
                        />
                    )}
                </footer>
            </div>
        </Wrapper>
    );
};

export default MyApplicationItem;
