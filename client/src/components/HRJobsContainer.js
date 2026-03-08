import React, { useEffect } from 'react';
import { useAppContext } from '../context/appContext';
import Loading from './Loading';
import HRJob from './HRJob';
import Wrapper from '../assets/wrappers/JobsContainer';

export default function HRJobsContainer() {
    const { getJobs, jobs, isLoading } = useAppContext();

    useEffect(() => {
        // For HR, we show their own jobs (which might be public or private)
        getJobs();
    }, []);

    if (isLoading) {
        return <Loading center />;
    }

    const publicJobsCount = jobs.filter(j => j.isPublic).length;

    return (
        <Wrapper>
            <h5>{jobs.length} job listing{jobs.length !== 1 && 's'} found</h5>
            <div className='jobs'>
                {jobs.map((job) => {
                    return <HRJob key={job._id} {...job} />;
                })}
            </div>
        </Wrapper>
    );
}
