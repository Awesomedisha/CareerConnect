import React, { useEffect } from 'react';
import { useAppContext } from '../../context/appContext';
import Loading from '../../components/Loading';
import MyApplicationItem from '../../components/MyApplicationItem';
import Wrapper from '../../assets/wrappers/JobsContainer';

export default function MyApplications() {
    const { getApplications, userApplications, isLoading } = useAppContext();

    useEffect(() => {
        getApplications('userApplications');
    }, []);

    if (isLoading) {
        return <Loading center />;
    }

    if (userApplications.length === 0) {
        return (
            <Wrapper>
                <h2>You haven't applied to any jobs yet...</h2>
            </Wrapper>
        );
    }

    return (
        <>
            <div className='form-center' style={{ marginBottom: '2rem' }}>
                <h3>My Applications</h3>
            </div>
            <Wrapper>
                <h5>{userApplications.length} application{userApplications.length > 1 && 's'} found</h5>
                <div className='jobs'>
                    {userApplications.map((application) => {
                        return <MyApplicationItem key={application._id} {...application} />;
                    })}
                </div>
            </Wrapper>
        </>
    );
}
