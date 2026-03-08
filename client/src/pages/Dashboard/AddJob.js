import React, { useEffect } from 'react';
import { Alert, FormRow, FormRowSelect } from '../../components';
import { useAppContext } from '../../context/appContext';
import Wrapper from '../../assets/wrappers/DashboardFormPage';

export default function AddJob() {
  const {
    isEditing,
    isLoading,
    showAlert,
    displayAlert,
    position,
    company,
    jobLocation,
    jobType,
    jobTypeOptions,
    status,
    statusOptions,
    handleChange,
    clearValues,
    createJob,
    editJob,
    user,
    isPublic,
    requirements,
    ...state
  } = useAppContext();

  useEffect(() => {
    if (user?.role === 'hr' && !isEditing) {
      handleChange({ name: 'isPublic', value: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!position || !company || !jobLocation) {
      displayAlert();
      return;
    }

    if (isEditing) {
      editJob();
      return;
    }

    createJob();
  };

  const handleJobInput = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    handleChange({ name, value });
  };

  return (
    <Wrapper>
      <form className='form'>
        <h3>{isEditing ? 'edit job' : 'add premium job'}</h3>
        {showAlert && <Alert />}

        {/* Basic Info Section */}
        <h4 className="section-title">Basic Information</h4>
        <div className="form-center">
          <FormRow type="text" name="position" value={position} handleChange={handleJobInput} labelText="Position/Title (Internal)" />
          <FormRow type="text" name="title" value={state.title} handleChange={handleJobInput} labelText="Job Display Title" />
          <FormRow type="text" name="company" value={company} handleChange={handleJobInput} />
          <FormRow type="text" name="jobId" value={state.jobId} handleChange={handleJobInput} labelText="Job ID / Code" />
          <FormRow type="text" name="jobRole" value={state.jobRole} handleChange={handleJobInput} labelText="Job Role" />
          <FormRow type="text" name="jobCategory" value={state.jobCategory} handleChange={handleJobInput} labelText="Job Category" />
          <FormRow type="text" name="department" value={state.department} handleChange={handleJobInput} />
        </div>

        {/* Classification Section */}
        <h4 className="section-title">Classification & Mode</h4>
        <div className="form-center">
          <FormRowSelect name="status" value={status} handleChange={handleJobInput} list={['open', 'closed', 'draft', 'pending', 'interview', 'declined']} />
          <FormRowSelect labelText="job type" name="jobType" value={jobType} handleChange={handleJobInput} list={['full-time', 'part-time', 'remote', 'internship', 'contract', 'freelance']} />
          <FormRowSelect labelText="work mode" name="workMode" value={state.workMode} handleChange={handleJobInput} list={['on-site', 'remote', 'hybrid']} />
          <FormRow type="text" name="employmentType" value={state.employmentType} handleChange={handleJobInput} labelText="Employment Type (e.g. Permanent)" />

          <div className='form-row checkbox-row'>
            <label htmlFor='isPublic' className='form-label'>Public Listing</label>
            <input type='checkbox' name='isPublic' id='isPublic' checked={isPublic} onChange={(e) => handleChange({ name: e.target.name, value: e.target.checked })} className='form-input checkbox' />
          </div>
          <div className='form-row checkbox-row'>
            <label htmlFor='isFeatured' className='form-label'>Featured Job</label>
            <input type='checkbox' name='isFeatured' id='isFeatured' checked={state.isFeatured} onChange={(e) => handleChange({ name: e.target.name, value: e.target.checked })} className='form-input checkbox' />
          </div>
          <div className='form-row checkbox-row'>
            <label htmlFor='isUrgent' className='form-label'>Urgent Hiring</label>
            <input type='checkbox' name='isUrgent' id='isUrgent' checked={state.isUrgent} onChange={(e) => handleChange({ name: e.target.name, value: e.target.checked })} className='form-input checkbox' />
          </div>
        </div>

        {/* Location Section */}
        <h4 className="section-title">Location Details</h4>
        <div className="form-center">
          <FormRow type="text" name="jobLocation" value={jobLocation} handleChange={handleJobInput} labelText='Display Location' />
          <FormRow type="text" name="locationCity" value={state.locationCity} handleChange={handleJobInput} labelText='City' />
          <FormRow type="text" name="locationState" value={state.locationState} handleChange={handleJobInput} labelText='State/Province' />
          <FormRow type="text" name="locationCountry" value={state.locationCountry} handleChange={handleJobInput} labelText='Country' />
          <FormRow type="text" name="locationAddress" value={state.locationAddress} handleChange={handleJobInput} labelText='Full Address' />
        </div>

        {/* Salary & Openings Section */}
        <h4 className="section-title">Compensation & Capacity</h4>
        <div className="form-center">
          <FormRow type="number" name="salaryMin" value={state.salaryMin} handleChange={handleJobInput} labelText='Min Salary' />
          <FormRow type="number" name="salaryMax" value={state.salaryMax} handleChange={handleJobInput} labelText='Max Salary' />
          <FormRow type="text" name="currency" value={state.currency} handleChange={handleJobInput} />
          <FormRowSelect labelText="salary period" name="salaryPeriod" value={state.salaryPeriod} handleChange={handleJobInput} list={['monthly', 'yearly', 'hourly']} />
          <FormRow type="number" name="openings" value={state.openings} handleChange={handleJobInput} />
          <div className='form-row checkbox-row'>
            <label htmlFor='isNegotiable' className='form-label'>Salary Negotiable</label>
            <input type='checkbox' name='isNegotiable' id='isNegotiable' checked={state.isNegotiable} onChange={(e) => handleChange({ name: e.target.name, value: e.target.checked })} className='form-input checkbox' />
          </div>
        </div>

        {/* Requirements & Skills */}
        <h4 className="section-title">Detailed Requirements</h4>
        <div className="textarea-container">
          <div className='form-row'>
            <label htmlFor='description' className='form-label'>Full Job Description</label>
            <textarea name='description' id='description' value={state.description} onChange={handleJobInput} className='form-input text-area' />
          </div>
          <div className='form-row'>
            <label htmlFor='responsibilities' className='form-label'>Key Responsibilities</label>
            <textarea name='responsibilities' id='responsibilities' value={state.responsibilities} onChange={handleJobInput} className='form-input text-area' />
          </div>
          <div className='form-row'>
            <label htmlFor='requirements' className='form-label'>Requirements/Qualifications</label>
            <textarea name='requirements' id='requirements' value={requirements} onChange={handleJobInput} className='form-input text-area' />
          </div>
        </div>

        <div className="form-center">
          <FormRow type="text" name="skillsRequired" value={state.skillsRequired} handleChange={handleJobInput} labelText='Required Skills (comma separated)' />
          <FormRow type="text" name="skillsPreferred" value={state.skillsPreferred} handleChange={handleJobInput} labelText='Preferred Skills (comma separated)' />
          <FormRow type="text" name="techStack" value={state.techStack} handleChange={handleJobInput} labelText='Tech Stack (comma separated)' />
          <FormRowSelect labelText="exp level" name="experienceLevel" value={state.experienceLevel} handleChange={handleJobInput} list={['entry', 'mid', 'senior', 'lead', 'executive']} />
          <FormRow type="number" name="experienceMin" value={state.experienceMin} handleChange={handleJobInput} labelText='Min Exp (Years)' />
          <FormRow type="number" name="experienceMax" value={state.experienceMax} handleChange={handleJobInput} labelText='Max Exp (Years)' />
        </div>

        {/* Benefits & Perks */}
        <h4 className="section-title">Benefits & Extras</h4>
        <div className="form-center">
          <FormRow type="text" name="benefits" value={state.benefits} handleChange={handleJobInput} labelText='Benefits (comma separated)' />
          <FormRow type="text" name="perks" value={state.perks} handleChange={handleJobInput} labelText='Perks (comma separated)' />
          <FormRow type="text" name="tags" value={state.tags} handleChange={handleJobInput} labelText='Tags (comma separated)' />
          <FormRow type="number" name="interviewRounds" value={state.interviewRounds} handleChange={handleJobInput} labelText='Interview Rounds' />
          <div className='form-row checkbox-row'>
            <label htmlFor='assessmentRequired' className='form-label'>Assessment Required</label>
            <input type='checkbox' name='assessmentRequired' id='assessmentRequired' checked={state.assessmentRequired} onChange={(e) => handleChange({ name: e.target.name, value: e.target.checked })} className='form-input checkbox' />
          </div>
        </div>

        {/* Deadline & Process */}
        <h4 className="section-title">Timelines & Process</h4>
        <div className="form-center">
          <FormRow type="date" name="applicationDeadline" value={state.applicationDeadline} handleChange={handleJobInput} labelText='Deadline' />
          <FormRow type="date" name="expectedJoiningDate" value={state.expectedJoiningDate} handleChange={handleJobInput} labelText='Expected Joining' />
          <FormRow type="text" name="applicationMethod" value={state.applicationMethod} handleChange={handleJobInput} labelText='App Method' />
          <FormRow type="text" name="externalApplyLink" value={state.externalApplyLink} handleChange={handleJobInput} labelText='External Link' />
        </div>
        <div className='form-row' style={{ padding: '0 1rem' }}>
          <label htmlFor='interviewProcess' className='form-label'>Interview Process Description</label>
          <textarea name='interviewProcess' id='interviewProcess' value={state.interviewProcess} onChange={handleJobInput} className='form-input text-area' style={{ height: '80px' }} />
        </div>

        <div className="btn-container">
          <button type='submit' className='btn btn-block submit-btn' onClick={handleSubmit} disabled={isLoading}>submit</button>
          <button className='btn btn-block clear-btn' onClick={(e) => { e.preventDefault(); clearValues(); }}>clear</button>
        </div>
      </form>
    </Wrapper>
  );
}
