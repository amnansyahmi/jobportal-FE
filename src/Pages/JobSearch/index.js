import React, {Fragment} from 'react';
import {Route} from 'react-router-dom';

import Search from './Search/';

// Layout

import AppHeader from '../../Layout/AppHeader/';
import AppSidebar from '../../Layout/AppSidebar/';
import AppFooter from '../../Layout/AppFooter/';

const JobSearch = ({match}) => (
    <Fragment>
        <AppHeader/>
        <div className="app-main">
            <AppSidebar/>
            <div className="app-main__outer">
                <div className="app-main__inner">
                    <Route path={`${match.url}/Search`} component={Search}/>
                </div>
                {/* <AppFooter/> */}
            </div>
        </div>
    </Fragment>
);

export default JobSearch;