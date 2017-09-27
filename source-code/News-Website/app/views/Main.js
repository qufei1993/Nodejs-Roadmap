import React from 'react';
import PropTypes from 'prop-types';

import {City} from 'react-city';

class Main extends React.Component {
  render() {
    return (
      <div>
        Main123
        <City />
      </div>
    );
  }
}

export default Main;
Main.contextTypes = {
  router: PropTypes.object.isRequired
};

*filter

	-A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT

	-A OUTPUT -j ACCEPT

	-A INPUT -p tcp --dport 443 -j ACCEPT

	-A INPUT -p tcp --dport 80 -j ACCEPT

	-A INPUT -p tcp -m state --state NEW --dport 39999 -j ACCEPT

	-A INPUT -p icmp -m icmp --icmp-type 8 -j ACCEPT

	-A INPUT -m limit --limit 5/min -j LOG --log-prefix "iptables denied:" --log-level 7

	-A INPUT -p tcp --dport 80 -i eth0 -m state --state NEW -m recent --set
	-A INPUT -p tcp --dport 80 -i eth0 -m state --state NEW -m recent --update --seconds 60 --hitcount 150 -j DROP


	-A INPUT -j REJECT
	-A FORWARD -j REJECT

COMMIT

upstream yuming {
  server 127.0.0.1:8081;
}

server {
  listen 80;

  server_name 116.62.215.31;

  location / {
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forward $proxy_add_x_forwarded_for;

    proxy_set_header Host $http_host;
    proxy_set_header X-Nginx-Proxy true;

    proxy_pass http:
    proxy_redirect off;
  }
}
