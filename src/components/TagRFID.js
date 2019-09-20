import React from 'react';
import Col from 'react-bootstrap/Col';
import { QRCode } from 'react-qrcode-logo';

const TagRFID = ({ tagId, url, logo }) => {
  return (
    <Col className="qrtag rfid">
      <div className="tag-title">Scan or Tap</div>
      <div className="tag-report">to refill paper towels</div>
      <QRCode
        value={url + "/" + tagId}
        size={150}
        quietZone="1px"
        ecLevel="M"
        logoImage={logo} />
      <div className="tag-id">{tagId}</div>
      <div className="tag-text">or enter code at</div>
      <div className="tag-text" style={{ color: "#87cefa"}}>tag.picolabs.io</div>
      <div className="tag-text" className="tag-footer">Pico Labs</div>
    </Col>
  );
}

export default TagRFID;
