import React from 'react';
import { useReducer, useContext, useEffect } from 'react';
import axios from 'axios';
import reducer from './reducer';
import {
  DISPLAY_ALERT,
  CLEAR_ALERT,
  REGISTER_USER_BEGIN,
  REGISTER_USER_SUCCESS,
  REGISTER_USER_ERROR,
  LOGIN_USER_BEGIN,
  LOGIN_USER_SUCCESS,
  LOGIN_USER_ERROR,
  TOGGLE_SIDEBAR,
  LOGOUT_USER,
  UPDATE_USER_BEGIN,
  UPDATE_USER_SUCCESS,
  UPDATE_USER_ERROR,
  HANDLE_CHANGE,
  CLEAR_VALUES,
  CREATE_JOB_BEGIN,
  CREATE_JOB_SUCCESS,
  CREATE_JOB_ERROR,
  GET_JOBS_BEGIN,
  GET_JOBS_SUCCESS,
  SET_EDIT_JOB,
  DELETE_JOB_BEGIN,
  EDIT_JOB_BEGIN,
  EDIT_JOB_SUCCESS,
  EDIT_JOB_ERROR,
  SHOW_STATS_BEGIN,
  SHOW_STATS_SUCCESS,
  CLEAR_FILTERS,
  CHANGE_PAGE,
  GET_CURRENT_USER_BEGIN,
  GET_CURRENT_USER_SUCCESS,
  APPLY_TO_JOB_BEGIN,
  APPLY_TO_JOB_SUCCESS,
  APPLY_TO_JOB_ERROR,
  GET_PUBLIC_JOBS_BEGIN,
  GET_PUBLIC_JOBS_SUCCESS,
  GET_APPLICATIONS_BEGIN,
  GET_APPLICATIONS_SUCCESS,
  UPDATE_APPLICATION_STATUS_BEGIN,
  UPDATE_APPLICATION_STATUS_SUCCESS,
} from "./actions";

const initialState = {
  userLoading: true,
  isLoading: false,
  showAlert: false,
  alertText: '',
  alertType: '',
  user: null,
  userLocation: '',
  showSidebar: false,
  position: '',
  company: '',
  jobLocation: '',
  jobType: 'full-time',
  jobTypeOptions: ['full-time', 'part-time', 'remote', 'internship'],
  status: 'pending',
  statusOptions: ['interview', 'declined', 'pending'],
  isEditing: false,
  editJobId: '',
  jobs: [],
  totalJobs: 0,
  numOfPages: 1,
  page: 1,
  stats: {},
  monthlyApplications: [],
  search: '',
  searchStatus: 'all',
  searchType: 'all',
  sort: 'latest',
  sortOptions: ['latest', 'oldest', 'a-z', 'z-a'],
  isPublic: false,
  requirements: '',
  bio: '',
  resume: '',
  publicJobs: [],
  userApplications: [],
  hrApplications: [],
}

const AppContext = React.createContext();

export default function AppProvider(props) {
  const { children } = props;
  const [state, dispatch] = useReducer(reducer, initialState);

  // Axios custom instance
  const authFetch = axios.create({
    baseURL: '/api/v1',
  });

  // Axios response interceptor
  authFetch.interceptors.response.use(
    function (response) {
      return response;
    },
    function (error) {
      console.log(`Error triggered in authFetch,
      Axios Response Interceptor
      error: ${error}`);

      if (error.response && error.response.status === 401) {
        console.log('Authentication Error');
        logoutUser();
      }

      return Promise.reject(error);
    }
  );

  const clearAlert = () => {
    setTimeout(() => {
      dispatch({
        type: CLEAR_ALERT,
      })
    }, 4000)
  };

  const displayAlert = () => {
    dispatch({
      type: DISPLAY_ALERT
    });
    clearAlert();
  };

  const registerUser = async (currentUser) => {
    dispatch({ type: REGISTER_USER_BEGIN });
    try {

      const response = await axios.post('/api/v1/auth/register', currentUser);
      const { user, location } = response.data;

      dispatch({
        type: REGISTER_USER_SUCCESS,
        payload: { user, location },
      });

    } catch (error) {
      dispatch({
        type: REGISTER_USER_ERROR,
        payload: { msg: error.response?.data?.msg || "Something went wrong, please try again later" },
      })
    }
    clearAlert();
  };

  const loginUser = async (currentUser) => {
    dispatch({ type: LOGIN_USER_BEGIN });
    try {
      const { data } = await axios.post(
        '/api/v1/auth/login',
        currentUser
      );

      const { user, location } = data;

      dispatch({
        type: LOGIN_USER_SUCCESS,
        payload: { user, location },
      });

    } catch (error) {
      dispatch({
        type: LOGIN_USER_ERROR,
        payload: { msg: error.response?.data?.msg || "Something went wrong, please try again later" },
      })
    }
    clearAlert();
  };

  const logoutUser = async () => {
    try {
      await authFetch.get('/auth/logout');
    } catch (error) {
      console.log(error);
    }
    dispatch({ type: LOGOUT_USER });
  };

  const updateUser = async (currentUser) => {

    dispatch({ type: UPDATE_USER_BEGIN });

    try {
      const { data } = await authFetch.patch('/auth/updateUser', currentUser);

      const { user, location } = data;

      dispatch({
        type: UPDATE_USER_SUCCESS,
        payload: { user, location },
      });

    } catch (error) {
      if (error.response && error.response.status !== 401) {
        dispatch({
          type: UPDATE_USER_ERROR,
          payload: { msg: error.response.data.msg },
        });
      }
    }
    clearAlert();
  };

  const toggleSidebar = () => {
    dispatch({ type: TOGGLE_SIDEBAR });
  };

  const handleChange = ({ name, value }) => {
    dispatch({
      type: HANDLE_CHANGE,
      payload: { name, value },
    });
  };

  const clearValues = () => {
    dispatch({
      type: CLEAR_VALUES,
    });
  };

  const createJob = async () => {
    dispatch({ type: CREATE_JOB_BEGIN });

    try {
      const {
        position,
        company,
        jobLocation,
        jobType,
        status,
        isPublic,
        requirements
      } = state;

      await authFetch.post('/jobs', {
        position,
        company,
        jobLocation,
        jobType,
        status,
        isPublic,
        requirements
      });

      dispatch({ type: CREATE_JOB_SUCCESS });
      dispatch({ type: CLEAR_VALUES });

    } catch (error) {
      if (error.response?.status === 401) {
        return;
      }

      dispatch({
        type: CREATE_JOB_ERROR,
        payload: { msg: error.response?.data?.msg || "Something went wrong, please try again later" },
      });
    }

    clearAlert();
  };


  const getJobs = async () => {
    // Destructure variables that deals with search parameters
    const { search, searchStatus, searchType, sort, page } = state;

    // let url = `/jobs`;
    // let url = `/jobs?status=${searchStatus}&jobType=${searchType}&sort=${sort}`;
    let url = `/jobs?page=${page}&status=${searchStatus}&jobType=${searchType}&sort=${sort}`;

    // If `search` is non-empty, appended it to the URL
    if (search) {
      url = url + `&search=${search}`;
    }

    dispatch({ type: GET_JOBS_BEGIN });

    try {
      const data = await authFetch(url);

      const { jobs, totalJobs, numOfPages } = data.data;

      dispatch({
        type: GET_JOBS_SUCCESS,
        payload: {
          jobs,
          totalJobs,
          numOfPages,
        },
      });

    } catch (error) {
      console.log(`Error triggered in getJobs() appContext.js! 
      Here is the Error Response:
      ${error.response}`);
      logoutUser();
    }
    clearAlert();
  };

  const setEditJob = async (jobId) => {
    dispatch({
      type: SET_EDIT_JOB,
      payload: { jobId }
    });
  };

  const editJob = async () => {
    dispatch({ type: EDIT_JOB_BEGIN });
    try {
      const { position, company, jobLocation, jobType, status, isPublic, requirements } = state;

      await authFetch.patch(`/jobs/${state.editJobId}`, {
        company,
        position,
        jobLocation,
        jobType,
        status,
        isPublic,
        requirements,
      });

      dispatch({ type: EDIT_JOB_SUCCESS });

      dispatch({ type: CLEAR_VALUES });

    } catch (error) {
      if (error.response?.status === 401) {
        return;
      }
      dispatch({
        type: EDIT_JOB_ERROR,
        payload: { msg: error.response?.data?.msg || "Something went wrong, please try again later" },
      })
    }
    clearAlert();
  };

  const deleteJob = async (jobId) => {
    dispatch({ type: DELETE_JOB_BEGIN });

    try {
      await authFetch.delete(`/jobs/${jobId}`);
      getJobs();
    } catch (error) {
      console.log(error.response);
    }
  };

  const showStats = async () => {
    dispatch({ type: SHOW_STATS_BEGIN });
    const url = '/jobs/stats';
    try {
      const { data } = await authFetch(url);

      dispatch({
        type: SHOW_STATS_SUCCESS,
        payload: {
          stats: data.defaultStats,
          monthlyApplications: data.monthlyApplications,
        },
      })
    } catch (error) {
      console.log(error.response);
      logoutUser();
    }

    clearAlert();
  };

  const clearFilters = () => {
    dispatch({ type: CLEAR_FILTERS });
  }

  const changePage = (page) => {
    dispatch({
      type: CHANGE_PAGE,
      payload: { page }
    });
  };


  const getCurrentUser = async () => {
    dispatch({ type: GET_CURRENT_USER_BEGIN });

    try {
      const { data } = await authFetch('/auth/getCurrentUser');
      const { user, location } = data;

      dispatch({
        type: GET_CURRENT_USER_SUCCESS,
        payload: { user, location },
      });

    } catch (error) {
      if (error.response && error.response.status === 401) {
        return;
      }
      dispatch({ type: LOGOUT_USER });
    }
  };

  const applyToJob = async (jobId) => {
    dispatch({ type: APPLY_TO_JOB_BEGIN });
    try {
      await authFetch.post('/applications', { jobId });
      dispatch({ type: APPLY_TO_JOB_SUCCESS });
    } catch (error) {
      dispatch({
        type: APPLY_TO_JOB_ERROR,
        payload: { msg: error.response?.data?.msg || "Something went wrong" },
      });
    }
    clearAlert();
  };

  const getPublicJobs = async () => {
    dispatch({ type: GET_PUBLIC_JOBS_BEGIN });
    try {
      const { data } = await authFetch.get('/jobs?isPublicListing=true');
      const { jobs } = data;
      dispatch({
        type: GET_PUBLIC_JOBS_SUCCESS,
        payload: { jobs },
      });
    } catch (error) {
      console.log(error);
    }
  };

  const getApplications = async (target, jobId = null) => {
    dispatch({ type: GET_APPLICATIONS_BEGIN });
    try {
      let url = '/applications';
      if (jobId) {
        url = `/applications/${jobId}/applications`;
      }
      const { data } = await authFetch.get(url);
      const { applications } = data;
      dispatch({
        type: GET_APPLICATIONS_SUCCESS,
        payload: { applications, target },
      });
    } catch (error) {
      console.log(error);
    }
  };

  const updateApplicationStatus = async (applicationId, status) => {
    dispatch({ type: UPDATE_APPLICATION_STATUS_BEGIN });
    try {
      await authFetch.patch(`/applications/${applicationId}`, { status });
      dispatch({ type: UPDATE_APPLICATION_STATUS_SUCCESS });
    } catch (error) {
      console.log(error);
    }
    clearAlert();
  };

  useEffect(() => {
    getCurrentUser();
  }, []);

  return (
    <AppContext.Provider
      value={{
        ...state,
        displayAlert,
        registerUser,
        loginUser,
        logoutUser,
        updateUser,
        toggleSidebar,
        handleChange,
        clearValues,
        createJob,
        getJobs,
        setEditJob,
        deleteJob,
        editJob,
        showStats,
        clearFilters,
        changePage,
        applyToJob,
        getPublicJobs,
        getApplications,
        updateApplicationStatus,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

const useAppContext = () => {
  return useContext(AppContext)
}

export { initialState, useAppContext }