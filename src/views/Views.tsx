import React from 'react'
import { Route, Switch } from 'react-router-dom'
import HomeView from './HomeView'
import SettingsView from './Settings'
import NoMatchView from './NoMatchView'

export default ({
}: any) => {
    return (
        <Switch>
            <Route exact path="/" component={HomeView} />   
            <Route exact path="/settings" component={SettingsView} />           
        
            <Route component={NoMatchView} />
        </Switch>
    )
}