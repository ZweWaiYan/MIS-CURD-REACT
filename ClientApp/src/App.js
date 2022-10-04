import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import RoleList from './view/Role/RoleList';
import NewRole from './view/Role/NewRole';
import FeatureList from './view/Feature/FeatureList';
import NewFeature from './view/Feature/NewFeature';
import PageFeatureList from './view/PageFeature/PageFeatureList';
import Tester from '../src/view/Tester/Tester'
// import {PivotViewComponent} from '@syncfusino/ej2=react-pivotview';
// @import url("https://cdn.syncfusion.com/ej2/bootstrap5.css");

import './custom.css'
import DetailPage from './view/Route/DetailPage';
import { Home } from './view/Home';

export default class App extends Component {
  static displayName = App.name;

  render () {
    return (
      <Layout>
        <Route exact path='/' component={Home} />
        <Route path='/role' component={RoleList} />
        <Route path='/newrole' component={NewRole} />
        <Route path='/editrole/:id' component={NewRole} />

        <Route path='/feature' component={FeatureList} />
        <Route path='/newfeature' component={NewFeature} />
        <Route path='/editfeature/:id' component={NewFeature} />

        <Route path= '/:MainRoute/:SubRoute' component={DetailPage}/>

        <Route path='/pagefeature/:id' component={PageFeatureList} />

        <Route path='/tester' component={Tester} />
      </Layout>
    );
  }
}
