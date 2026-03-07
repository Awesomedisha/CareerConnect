import React, { useEffect } from 'react';
import { useAppContext } from '../context/appContext';
import Loading from './Loading';
import PublicJob from './PublicJob';
import Wrapper from '../assets/wrappers/JobsContainer';

export default function PublicJobsContainer() {
    const { getPublicJobs, getApplications, publicJobs, isLoading } = useAppContext();

    useEffect(() => {
        getPublicJobs();
        getApplications('userApplications');
    }, []);

    if (isLoading) {
        return <Loading center />;
    }

    if (publicJobs.length === 0) {
        return (
            <Wrapper>
                <h2>No public job openings...</h2>
            </Wrapper>
        );
    }

    return (
        <Wrapper>
            <h5>{publicJobs.length} job{publicJobs.length > 1 && 's'} found</h5>
            <div className='jobs'>
                {publicJobs.map((job) => {
                    return <PublicJob key={job._id} {...job} />;
                })}
            </div>
        </Wrapper>
    );
}
