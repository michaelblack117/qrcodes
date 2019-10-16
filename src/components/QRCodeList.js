import React from 'react';
import { connect } from 'react-redux';

import Tag from './Tag';
import { storeFullURL } from '../actions';
import './styles.css';

export function randomString(length) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    for(var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

class QRCodeList extends React.Component {
  constructor(props) {
    super(props);

    this.state = { unavailableCodes: {}, isLoaded: false }
  }
  async componentDidMount() {
    let response = await fetch(`https://manifold.picolabs.io:9090/sky/cloud/VPa1BfnbD1DK9eJWzaszXb/io.picolabs.ds/allDomainData?domain=${this.props.url}`)
    const json = await response.json();
    this.setState({ unavailableCodes: json, isLoaded: true })
  }
  randomString(length) {
      var text = "";
      var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      for(var i = 0; i < length; i++) {
          text += possible.charAt(Math.floor(Math.random() * possible.length));
      }

      if (this.state.unavailableCodes && this.state.unavailableCodes[text]) {
        console.log(this.state.unavailableCodes[text]);
        return randomString(length);
      }
      return text;
  }
  renderList = () => {
    const { url, idType, prefix, length, suffix, fixedId, quantity,
      storeFullURL } = this.props;
    var list = [];
    for (var i = 0; i < quantity; i++) {
      let tagId = (idType === "fixed") ? fixedId :
        prefix + this.randomString(length) + suffix;

      storeFullURL(url + '/' + tagId);
      list.push(<Tag tagId={tagId} key={i} />);
    }
    return list;
  }
  render() {
    return (
      <div>
        {this.state.isLoaded &&
          <div id="qrcodes" className="row">
            {this.renderList()}
          </div>
        }
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    url: state.url,
    idType: state.idType,
    prefix: state.prefix,
    length: state.length,
    suffix: state.suffix,
    fixedId: state.fixedId,
    quantity: state.quantity
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    storeFullURL: (url) => {
      dispatch(storeFullURL(url));
    }
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(QRCodeList);
