import React from 'react';
import { useState } from 'react';
import { useAppContext } from '../../context/appContext';
import { FormRow, Alert } from '../../components';
import Wrapper from '../../assets/wrappers/DashboardFormPage';

export default function Profile() {
  const { user, showAlert, displayAlert, updateUser, isLoading } = useAppContext();

  // Basic Info
  const [name, setName] = useState(user?.name || '');
  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [location, setLocation] = useState(user?.location || '');
  const [city, setCity] = useState(user?.city || '');
  const [stateName, setStateName] = useState(user?.state || '');
  const [country, setCountry] = useState(user?.country || '');

  // Profile Meta
  const [headline, setHeadline] = useState(user?.headline || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [dateOfBirth, setDateOfBirth] = useState(user?.dateOfBirth ? user.dateOfBirth.split('T')[0] : '');
  const [gender, setGender] = useState(user?.gender || '');

  // Links
  const [portfolioUrl, setPortfolioUrl] = useState(user?.portfolioUrl || '');
  const [linkedinUrl, setLinkedinUrl] = useState(user?.linkedinUrl || '');
  const [githubUrl, setGithubUrl] = useState(user?.githubUrl || '');
  const [personalWebsite, setPersonalWebsite] = useState(user?.personalWebsite || '');

  // Professional
  const [resume, setResume] = useState(user?.resume || '');
  const [skills, setSkills] = useState(user?.skills?.join(', ') || '');
  const [primarySkills, setPrimarySkills] = useState(user?.primarySkills?.join(', ') || '');
  const [secondarySkills, setSecondarySkills] = useState(user?.secondarySkills?.join(', ') || '');
  const [techStack, setTechStack] = useState(user?.techStack?.join(', ') || '');
  const [experienceYears, setExperienceYears] = useState(user?.experienceYears || 0);
  const [currentCompany, setCurrentCompany] = useState(user?.currentCompany || '');
  const [currentJobTitle, setCurrentJobTitle] = useState(user?.currentJobTitle || '');

  // Education (simplified for form)
  const [degree, setDegree] = useState(user?.degree || '');
  const [university, setUniversity] = useState(user?.university || '');
  const [graduationYear, setGraduationYear] = useState(user?.graduationYear || '');
  const [cgpa, setCgpa] = useState(user?.cgpa || 0);

  // Preferences
  const [preferredJobRole, setPreferredJobRole] = useState(user?.preferredJobRole || '');
  const [preferredLocations, setPreferredLocations] = useState(user?.preferredLocations?.join(', ') || '');
  const [preferredJobType, setPreferredJobType] = useState(user?.preferredJobType || '');
  const [preferredWorkMode, setPreferredWorkMode] = useState(user?.preferredWorkMode || '');
  const [expectedSalaryMin, setExpectedSalaryMin] = useState(user?.expectedSalaryMin || 0);
  const [expectedSalaryMax, setExpectedSalaryMax] = useState(user?.expectedSalaryMax || 0);
  const [noticePeriod, setNoticePeriod] = useState(user?.noticePeriod || '');
  const [immediateJoiner, setImmediateJoiner] = useState(user?.immediateJoiner || false);
  const [openToWork, setOpenToWork] = useState(user?.openToWork || false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email) {
      displayAlert();
      return;
    }

    updateUser({
      name, firstName, lastName, fullName, email, phone, location, city, state: stateName, country,
      headline, bio, dateOfBirth, gender,
      portfolioUrl, linkedinUrl, githubUrl, personalWebsite,
      resume,
      skills: skills.split(',').map(s => s.trim()).filter(s => s),
      primarySkills: primarySkills.split(',').map(s => s.trim()).filter(s => s),
      secondarySkills: secondarySkills.split(',').map(s => s.trim()).filter(s => s),
      techStack: techStack.split(',').map(s => s.trim()).filter(s => s),
      experienceYears, currentCompany, currentJobTitle,
      degree, university, graduationYear, cgpa,
      preferredJobRole,
      preferredLocations: preferredLocations.split(',').map(s => s.trim()).filter(s => s),
      preferredJobType, preferredWorkMode,
      expectedSalaryMin, expectedSalaryMax,
      noticePeriod, immediateJoiner, openToWork
    });
  }

  return (
    <Wrapper>
      <form className="form" onSubmit={handleSubmit}>
        <h3>User Profile</h3>
        {showAlert && <Alert />}

        {/* Section: Basic Information */}
        <h4 className="section-title">Personal Information</h4>
        <div className="form-center">
          <FormRow type='text' name='name' value={name} labelText="Username/Display Name" handleChange={(e) => setName(e.target.value)} />
          <FormRow type='text' name='firstName' value={firstName} labelText="First Name" handleChange={(e) => setFirstName(e.target.value)} />
          <FormRow type='text' name='lastName' value={lastName} labelText="Last Name" handleChange={(e) => setLastName(e.target.value)} />
          <FormRow type='text' name='headline' value={headline} labelText="Headline" handleChange={(e) => setHeadline(e.target.value)} />
          <FormRow type='email' name='email' value={email} handleChange={(e) => setEmail(e.target.value)} />
          <FormRow type='text' name='phone' value={phone} handleChange={(e) => setPhone(e.target.value)} />
          <div className='form-row'>
            <label htmlFor='gender' className='form-label'>Gender</label>
            <select name='gender' value={gender} onChange={(e) => setGender(e.target.value)} className='form-select'>
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
              <option value="prefer not to say">Prefer not to say</option>
            </select>
          </div>
          <FormRow type='date' name='dateOfBirth' value={dateOfBirth} labelText="Date of Birth" handleChange={(e) => setDateOfBirth(e.target.value)} />
        </div>

        {/* Section: Location */}
        <h4 className="section-title">Location Details</h4>
        <div className="form-center">
          <FormRow type='text' name='location' value={location} labelText="Display Location" handleChange={(e) => setLocation(e.target.value)} />
          <FormRow type='text' name='city' value={city} handleChange={(e) => setCity(e.target.value)} />
          <FormRow type='text' name='state' value={stateName} handleChange={(e) => setStateName(e.target.value)} />
          <FormRow type='text' name='country' value={country} handleChange={(e) => setCountry(e.target.value)} />
        </div>

        {/* Section: Social & Links */}
        <h4 className="section-title">Social & Professional Links</h4>
        <div className="form-center">
          <FormRow type='text' name='linkedinUrl' value={linkedinUrl} labelText="LinkedIn URL" handleChange={(e) => setLinkedinUrl(e.target.value)} />
          <FormRow type='text' name='githubUrl' value={githubUrl} labelText="GitHub URL" handleChange={(e) => setGithubUrl(e.target.value)} />
          <FormRow type='text' name='portfolioUrl' value={portfolioUrl} labelText="Portfolio URL" handleChange={(e) => setPortfolioUrl(e.target.value)} />
          <FormRow type='text' name='personalWebsite' value={personalWebsite} labelText="Personal Website" handleChange={(e) => setPersonalWebsite(e.target.value)} />
        </div>

        {/* Section: Bio & Resume */}
        <h4 className="section-title">Bio & Professional Summary</h4>
        <div className='form-row'>
          <label htmlFor='bio' className='form-label'>Bio (Detailed summary)</label>
          <textarea name='bio' value={bio} onChange={(e) => setBio(e.target.value)} className='form-input text-area' style={{ height: '100px' }} />
        </div>
        <div className='form-row'>
          <label htmlFor='resume' className='form-label'>Resume (Plain text content for AI analysis)</label>
          <textarea name='resume' value={resume} onChange={(e) => setResume(e.target.value)} className='form-input text-area' style={{ height: '200px' }} />
        </div>

        {/* Section: Professional details */}
        <h4 className="section-title">Professional Details</h4>
        <div className="form-center">
          <FormRow type='text' name='skills' value={skills} labelText="General Skills (comma separated)" handleChange={(e) => setSkills(e.target.value)} />
          <FormRow type='text' name='primarySkills' value={primarySkills} labelText="Primary Skills" handleChange={(e) => setPrimarySkills(e.target.value)} />
          <FormRow type='text' name='secondarySkills' value={secondarySkills} labelText="Secondary Skills" handleChange={(e) => setSecondarySkills(e.target.value)} />
          <FormRow type='text' name='techStack' value={techStack} labelText="Tech Stack" handleChange={(e) => setTechStack(e.target.value)} />
          <FormRow type='number' name='experienceYears' value={experienceYears} labelText="Total Experience (Years)" handleChange={(e) => setExperienceYears(e.target.value)} />
          <FormRow type='text' name='currentJobTitle' value={currentJobTitle} labelText="Current Job Title" handleChange={(e) => setCurrentJobTitle(e.target.value)} />
          <FormRow type='text' name='currentCompany' value={currentCompany} labelText="Current Company" handleChange={(e) => setCurrentCompany(e.target.value)} />
        </div>

        {/* Section: Education */}
        <h4 className="section-title">Education Highlights</h4>
        <div className="form-center">
          <FormRow type='text' name='degree' value={degree} labelText="Highest Degree" handleChange={(e) => setDegree(e.target.value)} />
          <FormRow type='text' name='university' value={university} labelText="University/School" handleChange={(e) => setUniversity(e.target.value)} />
          <FormRow type='number' name='graduationYear' value={graduationYear} labelText="Graduation Year" handleChange={(e) => setGraduationYear(e.target.value)} />
          <FormRow type='number' name='cgpa' value={cgpa} labelText="CGPA/Grade" handleChange={(e) => setCgpa(e.target.value)} />
        </div>

        {/* Section: Preferences */}
        <h4 className="section-title">Career Preferences</h4>
        <div className="form-center">
          <FormRow type='text' name='preferredJobRole' value={preferredJobRole} labelText="Preferred Job Role" handleChange={(e) => setPreferredJobRole(e.target.value)} />
          <FormRow type='text' name='preferredLocations' value={preferredLocations} labelText="Preferred Locations" handleChange={(e) => setPreferredLocations(e.target.value)} />
          <FormRow type='number' name='expectedSalaryMin' value={expectedSalaryMin} labelText="Min Expected Salary" handleChange={(e) => setExpectedSalaryMin(e.target.value)} />
          <FormRow type='number' name='expectedSalaryMax' value={expectedSalaryMax} labelText="Max Expected Salary" handleChange={(e) => setExpectedSalaryMax(e.target.value)} />
          <div className='form-row checkbox-row' style={{ gridColumn: 'span 1' }}>
            <label htmlFor='immediateJoiner' className='form-label'>Immediate Joiner</label>
            <input type='checkbox' name='immediateJoiner' checked={immediateJoiner} onChange={(e) => setImmediateJoiner(e.target.checked)} className='form-input checkbox' />
          </div>
          <div className='form-row checkbox-row' style={{ gridColumn: 'span 1' }}>
            <label htmlFor='openToWork' className='form-label'>Open to Work</label>
            <input type='checkbox' name='openToWork' checked={openToWork} onChange={(e) => setOpenToWork(e.target.checked)} className='form-input checkbox' />
          </div>
        </div>

        <button className="btn btn-block" type='submit' disabled={isLoading} style={{ marginTop: '2rem' }}>
          {isLoading ? 'Please Wait...' : 'Save Profile Changes'}
        </button>
      </form>
    </Wrapper>
  );
}
