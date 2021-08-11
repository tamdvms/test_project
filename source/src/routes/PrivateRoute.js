import React from 'react';
import { Route } from 'react-router-dom';

import MasterLayout from '../compoments/common/appLayout/MasterLayout';
import { sitePathConfig } from '../constants/sitePathConfig';

const PrivateRoute = ({ component: Component, ...rest }) => {

    const siteConfig = Object.values(sitePathConfig).find(s => s.path === rest.path)?.siteConfig
    return (
        <Route {...rest} render={props => 
                (
                    <MasterLayout {...props} siteConfig={siteConfig}>
                        <Component {...props}/>
                    </MasterLayout>
                )
            }
        />
    )
}

export default PrivateRoute;
