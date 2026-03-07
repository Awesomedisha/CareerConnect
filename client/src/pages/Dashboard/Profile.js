import React from 'react';
import { useState } from 'react';
import { useAppContext } from '../../context/appContext';
import { FormRow, Alert } from '../../components';
import Wrapper from '../../assets/wrappers/DashboardFormPage';

export default function Profile() {
  const { user, showAlert, displayAlert, updateUser, isLoading } =
    useAppContext();

  const [name, setName] = useState(user?.name);
  const [email, setEmail] = useState(user?.email);
  const [lastName, setLastName] = useState(user?.lastName);
  const [location, setLocation] = useState(user?.location);
  const [bio, setBio] = useState(user?.bio || '');
  const [resume, setResume] = useState(user?.resume || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !lastName || !location) {
      displayAlert();
      return;
    }

    updateUser({ name, email, lastName, location, bio, resume });
  }

  return (
    <Wrapper>
      <form action="" className="form" onSubmit={handleSubmit}>
        <h3>profile</h3>
        {showAlert && <Alert />}

        <div className="form-center">

          <FormRow
            type='text'
            name='name'
            value={name}
            handleChange={(e) => setName(e.target.value)}
          />
          <FormRow
            type='text'
            name='lastName'
            value={lastName}
            handleChange={(e) => setLastName(e.target.value)}
            labelText='last name'
          />
          <FormRow
            type='email'
            name='email'
            value={email}
            handleChange={(e) => setEmail(e.target.value)}
          />
          <FormRow
            type='text'
            name='location'
            value={location}
            handleChange={(e) => setLocation(e.target.value)}
          />
          <div className='form-row'>
            <label htmlFor='bio' className='form-label'>
              bio (short summary)
            </label>
            <textarea
              name='bio'
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className='form-input'
              style={{ height: '80px', width: '100%', padding: '0.5rem' }}
            />
          </div>
          <div className='form-row' style={{ gridColumn: 'span 2' }}>
            <label htmlFor='resume' className='form-label'>
              resume (text)
            </label>
            <textarea
              name='resume'
              value={resume}
              onChange={(e) => setResume(e.target.value)}
              className='form-input'
              style={{ height: '200px', width: '100%', padding: '0.5rem' }}
            />
          </div>
          <button className="btn btn-block" type='submit' disabled={isLoading}>
            {isLoading ? 'Please Wait...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </Wrapper>
  );
};
