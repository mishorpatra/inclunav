import React from 'react';
import { Route } from 'react-router-dom';
import Landing from  './components/landing/Landing';
import LanguageSelect from './components/landing/LanguageSelect';
import Registration from './components/authentication/Registration';
import AllowAccess from './components/feedback/AllowAccess';
import ResetPassword from './components/authentication/ResetPassword';
import ForgotPass from './components/authentication/ForgotPass';
import CheckMessage from './components/feedback/CheckMessage';
import ContactSupport from './components/feedback/ContactSupport';
import Dashboard from './components/dashboard/Dashboard';
import UserRegistration from './components/authentication/UserRegistration';
import UserLogin from './components/authentication/UserLogin';
import ColoredRect from './components/dashboard/navigation/Konva';
import GlobalView from './components/dashboard/global/GlobalView';

const BaseRouter = ()=>{
    return(
    <div>   
            <Route exact path="/" component={Landing}/>
            <Route exact path="/language-select" component={LanguageSelect}/>
            <Route exact path="/login" component={UserLogin}/>
            <Route exact path="/contact" component={ContactSupport}/>
            <Route exact path="/register" component={UserRegistration}/>
            <Route exact path="/success" component={Registration}/>
            <Route exact path="/access" component={AllowAccess}/>
            <Route exact path="/reset-password" component={ResetPassword}/>
            <Route exact path="/forgot-password" component={ForgotPass}/>
            <Route exact path="/check-message" component={CheckMessage}/>
            <Route exact path="/dashboard" component={Dashboard}/>
            <Route exact path="/navigate" component={Dashboard}/>
            <Route exact path="/settings" component={Dashboard}/>
            <Route exact path="/profile-settings" component={Dashboard}/>
            <Route exact path="/navigation-settings" component={Dashboard}/>
            <Route exact path="/konva" component={ColoredRect}/>
            <Route exact path="/inclusive" component={Dashboard}/>
            <Route exact path="/global-view" component={Dashboard}/>
    </div>)
}

export default BaseRouter