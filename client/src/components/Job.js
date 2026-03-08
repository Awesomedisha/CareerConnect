import React from 'react';
import moment from 'moment';
import { FaLocationArrow, FaBriefcase, FaCalendarAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/appContext';
import Wrapper from '../assets/wrappers/Job';
import JobInfo from './JobInfo';

export default function Job(props) {
  const {
    _id,
    position,
    title,
    company,
    jobLocation,
    jobType,
    createdAt,
    status,
    salaryMin,
    salaryMax,
    currency,
    isFeatured,
    isUrgent,
    locationCity,
  } = props;

  const {
    setEditJob,
    deleteJob,
  } = useAppContext();

  let date = moment(createdAt);
  date = date.format('MMM Do, YYYY'); // Apr 14th 23

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
      </header>
      <div className="content">
        <div className="content-center">
          <JobInfo icon={<FaLocationArrow />} text={locationCity ? `${locationCity}, ${jobLocation}` : jobLocation} />
          <JobInfo icon={<FaCalendarAlt />} text={date} />
          <JobInfo icon={<FaBriefcase />} text={jobType} />
          {salaryMin > 0 && (
            <JobInfo icon={<strong>$</strong>} text={`${currency} ${salaryMin.toLocaleString()} - ${salaryMax.toLocaleString()}`} />
          )}
          <div className={`status ${status}`}>{status}</div>
        </div>
        <footer>
          <div className="actions">
            <Link
              to='/add-job'
              className="btn edit-btn"
              onClick={() => setEditJob(_id)}
            >
              Edit
            </Link>
            <button
              type='button'
              className='btn delete-btn'
              onClick={() => deleteJob(_id)}
            >
              Delete
            </button>
          </div>
        </footer>
      </div>
    </Wrapper>
  );
}
