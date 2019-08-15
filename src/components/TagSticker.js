import React from 'react';
import Col from 'react-bootstrap/Col';
import { QRCode } from 'react-qrcode-logo';

function idBackground(tagId) {
  return tagId.length > 6 ? "long-background" : "short-background"
}
const TagSticker = ({ tagId, url, logo }) => {
  return (
    <Col className="qrtag sticker">
      <div className="tag-title">Scan Me</div>
      <QRCode
        value={url + "/" + tagId}
        size={50}
        quietZone="2px"
        ecLevel="M"
        logoImage={logo} />
      <div className={"tag-id " + idBackground(tagId)}>{tagId}</div>
      <div className="tag-text">tag.picolabs.io</div>
    </Col>
  );
}

export default TagSticker;
