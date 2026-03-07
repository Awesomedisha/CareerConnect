import React from 'react';
import PublicJobsContainer from '../../components/PublicJobsContainer';

export default function JobMarket() {
    return (
        <>
            <div className='form-center' style={{ marginBottom: '2rem' }}>
                <h3>Public Job Openings</h3>
            </div>
            <PublicJobsContainer />
        </>
    );
}
