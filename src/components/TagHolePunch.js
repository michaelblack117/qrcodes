import React from 'react';
import Col from 'react-bootstrap/Col';
import { QRCode } from 'react-qrcode-logo';

const TagHolePunch = ({ tagId, url, logo }) => {
  return (
    <Col className="qrtag hole-punch">
      <i className="fa fa-circle-thin" style={{ marginTop: "4px" }} />
      <br />
      <div className="tag-title">Scan Me</div>
      <QRCode
        value={url + "/" + tagId}
        size={50}
        quietZone="0px"
        ecLevel="L"
        logoImage={logo} />
      <div className="tag-id">{tagId}</div>
      <div className="tag-text">or enter code at
        <span style={{ color: "#87cefa"}}> picolabs.io</span>
      </div>
    </Col>
  );
}

export default TagHolePunch;
