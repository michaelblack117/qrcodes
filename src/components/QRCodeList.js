import React from 'react';
import { connect } from 'react-redux';

import Tag from './Tag';
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
    const { idType, prefix, length, suffix, fixedId, quantity } = this.props;
    var list = [];
    for (var i = 0; i < quantity; i++) {
      let tagId = (idType === "fixed") ? fixedId :
        prefix + randomString(length) + suffix;
      list.push(
        <Tag tagId={tagId} key={i} />
      );
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
    idType: state.idType,
    prefix: state.prefix,
    length: state.length,
    suffix: state.suffix,
    fixedId: state.fixedId,
    quantity: state.quantity
  }
}
export default connect(mapStateToProps)(QRCodeList);
