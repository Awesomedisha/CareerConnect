import React from 'react';
import HRJobsContainer from '../../components/HRJobsContainer';

export default function HRDashboard() {
    return (
        <>
            <div className='form-center' style={{ marginBottom: '2rem' }}>
                <h3>HR Dashboard - Manage Openings</h3>
            </div>
            <HRJobsContainer />
        </>
    );
}
