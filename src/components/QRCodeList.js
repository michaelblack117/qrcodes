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
  renderList = () => {
    const { url, idType, prefix, length, suffix, fixedId, quantity,
      storeFullURL } = this.props;
    var list = [];
    for (var i = 0; i < quantity; i++) {
      let tagId = (idType === "fixed") ? fixedId :
        prefix + randomString(length) + suffix;

      storeFullURL(url + '/' + tagId);
      list.push(<Tag tagId={tagId} key={i} />);
    }
    return list;
  }
  render() {
    return (
      <div>
        <div id="qrcodes" className="row">
          {this.renderList()}
        </div>
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
