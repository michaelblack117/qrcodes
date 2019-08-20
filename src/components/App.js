import React from 'react';
import { connect } from 'react-redux';

import QRForm from './QRForm';
import DownloadPDF from './DownloadPDF';
import DownloadText from './DownloadText';
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
          {this.props.quantity > 0 &&
            <div className="row">
              <div className="col">
                <DownloadPDF elementId="qrcodes" label="Download QR Codes" />
              </div>
              <div className="col">
                <DownloadText label="Download URL List"/>
              </div>
            </div>}
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
