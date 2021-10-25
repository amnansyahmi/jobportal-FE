import {BrowserRouter as Router, Route, Redirect} from 'react-router-dom';
import React, {Suspense, lazy, Fragment} from 'react';

import {
    ToastContainer,
} from 'react-toastify';

const JobSearch = lazy(() => import('../../Pages/JobSearch'));
const ApplicationForm = lazy(() => import('../../Pages/ApplicationForm'));
const ApplicantStatus = lazy(() => import('../../Pages/ApplicantStatus'));

const AppMain = () => {

    return (
        <Fragment>

            {/* Job Search */}

            <Suspense fallback={
                <div className="loader-container">
                    <div className="loader-container-inner">
                        <h6 className="mt-3">
                            Please wait while we load all the Job Search Page
                            <small>Because this is a demonstration, we load at once all the Job Search Pages. This wouldn't happen in a real live app!</small>
                        </h6>
                    </div>
                </div>
            }>
                <Route path="/jobsearch" component={JobSearch}/>
            </Suspense>

            {/* Applicant Status */}

            <Suspense fallback={
                <div className="loader-container">
                    <div className="loader-container-inner">
                        <h6 className="mt-3">
                            Please wait while we load all the Applicant Status Page
                            <small>Because this is a demonstration, we load at once all the Applicant Status Pages. This wouldn't happen in a real live app!</small>
                        </h6>
                    </div>
                </div>
            }>
                <Route path="/applicantstatus" component={ApplicantStatus}/>
            </Suspense>

            {/* Application Form */}

            <Suspense fallback={
                <div className="loader-container">
                    <div className="loader-container-inner">
                        <h6 className="mt-3">
                            Please wait while we load all the Application Form Page
                            <small>Because this is a demonstration, we load at once all the Application Form Pages. This wouldn't happen in a real live app!</small>
                        </h6>
                    </div>
                </div>
            }>
                <Route path="/applicationform" component={ApplicationForm}/>
            </Suspense>
            
            <Route exact path="/" render={() => (
                <Redirect to="/jobsearch/search"/>
            )}/>
            <ToastContainer/>
        </Fragment>
    )
};

export default AppMain;