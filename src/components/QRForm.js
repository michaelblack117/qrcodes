import React from 'react';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import Fade from 'react-bootstrap/Fade';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import { connect } from 'react-redux';
import { randomString } from './QRCodeList';

import { generate, create, resetURLList } from '../actions';

class QRForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      url: "",
      idType: "random",
      prefix: "",
      length: 0,
      suffix: "",
      quantity: 0,
      tagType: "",
      fixedId: "",
      validated: false
    }
  }
  isFixed() {
    return this.state.idType === "fixed";
  }
  QRCodeLength() {
    const { url, prefix, length, suffix, fixedId } = this.state;
    if (this.isFixed()) {
      return url.length + fixedId.length;
    }
    return url.length + prefix.length + parseInt(length, 10) + suffix.length;
  }
  showResolutionWarning() {
    var length = this.QRCodeLength();
    if (length >= 26) {
      return true;
    }
    return false;
  }
  showDuplicateWarning() {
    if (this.isFixed() && this.state.quantity > 1) {
      return true;
    }
    return false;
  }

  handleTabSelect = (tab) => {
    this.setState({ idType: tab })
  }
  handleChange = (event) => {
    var { value, id } = event.target;
    if (id === "suffix" || id === "prefix" || id === "fixedId") {
      value = value.toUpperCase();
    }
    this.setState({
      [id]: value
    });
  }
  handleSubmit = (event) => {
    const form = event.currentTarget;
    event.preventDefault();

    this.setState({ validated: true });
    if (form.checkValidity() === false) {
      event.stopPropagation();
      return;
    }

    const { url, idType, prefix, length, suffix, quantity, tagType, fixedId } = this.state;

    this.props.resetURLList();
    
    if (this.isFixed()) {
      this.props.create(url, idType, fixedId, quantity, tagType);
    }
    else {
      this.props.generate(url, idType, prefix, length, suffix, quantity, tagType);
    }
  }
  renderExampleText = () => {
    const { url, prefix, length, suffix, fixedId } = this.state;
    const id = this.isFixed() ? fixedId : prefix + randomString(length) + suffix;
    if (url.length === 0) return "";
    return `${url}/${id}`;
  }
  render() {
    return (
      <Form noValidate validated={this.state.validated} onSubmit={this.handleSubmit}>
        <Row>
          <Form.Group as={Col} xs={6} style={{ marginTop: "40px"}}>
            <Form.Label>*URL</Form.Label>
            <Form.Control
              required
              id="url"
              value={this.state.url}
              onChange={this.handleChange}
              type="text"
              placeholder="http://example.com" />
          </Form.Group>
        <Col>
          <Tabs
            id="idType"
            defaultActiveKey="random"
            activeKey={this.state.idType}
            onSelect={this.handleTabSelect}
            transition={Fade}>
            <Tab eventKey="random" title="Random ID">
              <Row>
                <Form.Group as={Col}>
                  <Form.Label>Prefix</Form.Label>
                  <Form.Control
                    id="prefix"
                    value={this.state.prefix}
                    onChange={this.handleChange}
                    pattern="[a-zA-Z0-9]*"
                    type="text" />
                  <Form.Control.Feedback type="invalid">
                    Must be and alpha-numeric string
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group as={Col}>
                  <Form.Label>*ID Length</Form.Label>
                  <Form.Control
                    required={!this.isFixed()}
                    id="length"
                    value={this.state.length}
                    onChange={this.handleChange}
                    min={!this.isFixed() ? 1 : 0}
                    type="number" />
                  <Form.Control.Feedback type="invalid">
                    Must be a number greater than zero
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group as={Col}>
                  <Form.Label>Suffix</Form.Label>
                  <Form.Control
                    id="suffix"
                    value={this.state.suffix}
                    onChange={this.handleChange}
                    pattern="[a-zA-Z0-9]*"
                    type="text" />
                  <Form.Control.Feedback type="invalid">
                    Must be and alpha-numeric string
                  </Form.Control.Feedback>
                </Form.Group>
              </Row>
            </Tab>
            <Tab eventKey="fixed" title="Fixed ID">
              <Form.Group as={Col}>
                <Form.Label>*Tag ID</Form.Label>
                <Form.Control
                  required={this.isFixed()}
                  id="fixedId"
                  value={this.state.fixedId}
                  onChange={this.handleChange}
                  pattern="[a-zA-Z0-9]*"
                  type="text" />
                <Form.Control.Feedback type="invalid">
                  Must be and alpha-numeric string
                </Form.Control.Feedback>
              </Form.Group>
            </Tab>
          </Tabs>
        </Col>
        </Row>

        <Row>
          <Col>
            <Form.Label>Full URL Preview</Form.Label>
            <Form.Control readOnly
              id="example"
              value={this.renderExampleText()}
              />
          </Col>
          <Form.Group as={Col} xs={2}>
            <Form.Label>*Quantity</Form.Label>
            <Form.Control
              required
              id="quantity"
              value={this.state.quantity}
              onChange={this.handleChange}
              min={1}
              type="number" />
            <Form.Control.Feedback type="invalid">
              Must be a number greater than zero
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group as={Col} xs={3}>
            <Form.Label>*Tag Type</Form.Label>
            <Form.Control
              required
              id="tagType"
              value={this.state.tagType}
              onChange={this.handleChange}
              as="select">
              <option value="">Choose...</option>
              <option value="HolePunch">Hole Punch</option>
              <option value="Rfid">RFID Card</option>
              <option value="Sticker">Sticker</option>
            </Form.Control>
            <Form.Control.Feedback type="invalid">
              What kind of tag would you like to generate?
            </Form.Control.Feedback>
          </Form.Group>
        </Row>
        <br/>

        {this.showResolutionWarning() &&
        <Alert variant="warning">
          <Alert.Heading>QR Resolution Warning</Alert.Heading>
          <p>The length of the full url may cause the QR code resolution to be inadequate for any device to scan</p>
          <p>If you choose the RFID Tag Type then the resolution will be fine but check to make sure the ID doesn't extend farther than the background</p>
        </Alert>}

        {this.showDuplicateWarning() &&
        <Alert variant="warning">
          <Alert.Heading>Warning</Alert.Heading>
          <p>You are about to print multiple tags with the same ID</p>
        </Alert>}

        <Button block type="submit" disabled={this.props.downloading}>Generate QR Codes</Button>
      </Form>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    downloading: state.downloading
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    generate: (url, idType, prefix, length, suffix, quantity, tagType) => {
      dispatch(generate(url, idType, prefix, length, suffix, quantity, tagType))
    },
    create: (url, idType, fixedId, quantity, tagType) => {
      dispatch(create(url, idType, fixedId, quantity, tagType))
    },
    resetURLList: () => {
      dispatch(resetURLList());
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(QRForm);
