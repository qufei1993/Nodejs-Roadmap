import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'antd';
import { Menu,Icon} from 'antd';
class HomeHeader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      current:'top',
    };
  };
  render() {
    console.log(this.props.test)
    return (
      <section>
        <Row>
          <Col span={2}></Col>
          <Col span={4}>
            <a href="#" class="logo">
              <img src="/images/logo.png" alt="News logo"/>
            </a>
          </Col>
          <Col span={16}>
            <Menu mode="horizontal" selectedKeys={[this.state.current]}>
              <Menu.Item key="top">
                <Icon type="appstore"/>头条
              </Menu.Item>
              <Menu.Item key="shehui">
                <Icon type="appstore"/>社会
              </Menu.Item>
              <Menu.Item key="guonei">
                <Icon type="appstore"/>国内
              </Menu.Item>
              <Menu.Item key="guoji">
                <Icon type="appstore"/>国际
              </Menu.Item>
              <Menu.Item key="yule">
                <Icon type="appstore"/>娱乐
              </Menu.Item>
              <Menu.Item key="tiyu">
                <Icon type="appstore"/>体育
              </Menu.Item>
              <Menu.Item key="keji">
                <Icon type="appstore"/>科技
              </Menu.Item>
              <Menu.Item key="shishang">
                <Icon type="appstore"/>时尚
              </Menu.Item>
            </Menu>
          </Col>
          <Col span={2}></Col>
        </Row>
      </section>
    );
  }
}
export default HomeHeader;