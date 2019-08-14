import React from 'react';
import Col from 'react-bootstrap/Col';
import { QRCode } from 'react-qrcode-logo';

function idBackground(tagId) {
  return tagId.length > 7 ? "long-background" : "short-background"
}
const TagSticker = ({ tagId, url, logo }) => {
  return (
    <Col className="qrtag sticker">
      <div className="tag-title">Scan Me</div>
      <QRCode
        value={url + "/" + tagId}
        size={25}
        quietZone="2px"
        ecLevel="L"
        logoImage={logo} />
      <div className={"tag-id " + idBackground(tagId)}>{tagId}</div>
      <div className="tag-text">picolabs.io</div>
    </Col>
  );
}

export default TagSticker;
