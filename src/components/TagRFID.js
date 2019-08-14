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
        size={50}
        quietZone="10px"
        ecLevel="L"
        logoImage={logo} />
      <div className="tag-id">{tagId}</div>
      <div className="tag-text">or enter code at
        <span style={{ color: "#87cefa"}}> picolabs.io</span>
      </div>
      <div className="tag-footer">Pico Labs</div>
    </Col>
  );
}

export default TagRFID;
