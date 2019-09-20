import React from 'react';
import Col from 'react-bootstrap/Col';
import { QRCode } from 'react-qrcode-logo';

const TagHolePunch = ({ tagId, url, logo }) => {
  return (
    <Col className="qrtag hole-punch">
      <i className="fa fa-circle-thin fa-2x" style={{ marginTop: "4px" }} />
      <br />
      <div className="tag-title">Scan If Found</div>
      <QRCode
        value={url + "/" + tagId}
        size={75}
        quietZone="5px"
        ecLevel="M"
        logoImage={logo} />
      <div className="tag-id">{tagId}</div>
      <div className="tag-text">or enter code at</div>
      <div className="tag-text" style={{ color: "#87cefa"}}> tag.picolabs.io</div>
    </Col>
  );
}

export default TagHolePunch;
