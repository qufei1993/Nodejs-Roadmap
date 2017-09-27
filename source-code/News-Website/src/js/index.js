import React from 'react'
import { render } from 'react-dom'
import { Router, browserHistory } from 'react-router'
import MediaQuery from 'react-responsive';
import routes from '../../app/views/routes'
import HomeHeader from '../../app/views/layout/HomeHeader'
import MobileHeader from '../../app/views/layout/MobileHeader'
import HomeFooter from '../../app/views/layout/HomeFooter'
import MobileFooter from '../../app/views/layout/MobileFooter'
import 'antd/dist/antd.css';

render((
    <div style={{ position: 'relative', minHeight: '100vh' }}>
    	  <MediaQuery query='(min-device-width: 1224px)'>
      		<HomeHeader test="123456" />
      	</MediaQuery>
      	<MediaQuery query='(max-device-width: 1224px)'>
      		<MobileHeader />
      	</MediaQuery>
      	<Router routes={routes} history={browserHistory} />
      	<MediaQuery query='(min-device-width:1224px)'>
			<HomeFooter />
      	</MediaQuery>
      	<MediaQuery query='(max-device-width:1224px)'>
			<MobileFooter />
      	</MediaQuery>
    </div>
),document.getElementById('city'))