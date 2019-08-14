import React from 'react';
import { connect } from 'react-redux';

import TagSticker from './TagSticker';
import TagHolePunch from './TagHolePunch';
import TagRFID from './TagRFID';
import logo from '../media/pico-logo.png';

class Tag extends React.Component {
  renderTagType() {
    const { url, tagId, tagType } = this.props;
    switch (tagType) {
      case 'Sticker':
        return <TagSticker tagId={tagId} url={url} logo={logo} />;
      case 'HolePunch':
        return <TagHolePunch tagId={tagId} url={url} logo={logo} />;
      case 'Rfid':
        return <TagRFID tagId={tagId} url={url} logo={logo} />;
      default:
        return <div>Unknown tag type</div>;
    }
  }
  render() {
    return (
      this.renderTagType()
    );
  }
}

const mapStateToProps = (state) => {
  return {
    url: state.url,
    tagType: state.tagType
  }
}

export default connect(mapStateToProps)(Tag);
