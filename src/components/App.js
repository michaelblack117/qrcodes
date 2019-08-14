import React from 'react';
import { connect } from 'react-redux';

import QRForm from './QRForm';
import DownloadButton from './DownloadButton';
import QRCodeList from './QRCodeList';

class App extends React.Component {
  render() {
      return (
      <div className="App">
        <div className="container">
          <QRForm />
        </div>
        <br />
        <div className="container">
          {this.props.quantity > 0 && <DownloadButton elementId="qrcodes" label="Download QR Codes" />}
          <br /><br />
          {this.props.quantity > 0 && <QRCodeList />}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    quantity: state.quantity
  }
}

export default connect(mapStateToProps)(App);
