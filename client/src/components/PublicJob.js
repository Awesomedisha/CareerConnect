import React from 'react';
import moment from 'moment';
import { FaLocationArrow, FaBriefcase, FaCalendarAlt } from 'react-icons/fa';
import { useAppContext } from '../context/appContext';
import Wrapper from '../assets/wrappers/Job';
import JobInfo from './JobInfo';

export default function PublicJob({
    _id,
    position,
    company,
    jobLocation,
    jobType,
    createdAt,
}) {
    const { applyToJob, userApplications, isLoading } = useAppContext();

    let date = moment(createdAt);
    date = date.format('MMM Do, YYYY');

    const alreadyApplied = userApplications.find((app) => app.job?._id === _id);

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
                </div>
                <footer>
                    <div className="actions">
                        <button
                            type='button'
                            className='btn edit-btn'
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
