import React from 'react';
import { connect } from 'react-redux';

class DownloadText extends React.Component {
  downloadTxtFile = () => {
    const file = new Blob(this.props.urlList, {type: 'text/plain'});
    const element = document.createElement("a");
    element.href = URL.createObjectURL(file);
    element.download = "qrcode-list.txt";
    document.body.appendChild(element); // required for this to work in firefox
    element.click();
  }
  render() {
    return (
      <div>
      <div id="myMm2" style={{height: "1mm"}} />
        <button className="btn-secondary" onClick={this.downloadTxtFile}>
          {this.props.label}
        </button>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    urlList: state.urlList
  }
}
export default connect(mapStateToProps)(DownloadText);
