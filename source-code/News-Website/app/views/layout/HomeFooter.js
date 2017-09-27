import React from 'react';
import {Row, Col} from 'antd';

class HomeFooter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}
  };
  render() {
    return (
      <footer>
        <Row>
          <Col span={24} class="footer">
            &copy;&nbsp;2017 Qufei-洛阳网站建设. All Rights Reserved.
          </Col>
        </Row>
      </footer>
    );
  }
}
export default HomeFooter;