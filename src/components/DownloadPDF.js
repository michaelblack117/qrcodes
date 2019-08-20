import React from 'react';
import { connect } from 'react-redux';
import { download, downloadComplete } from '../actions';
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf';
import './styles.css';

const pxToMm = (px) => {
  return Math.floor(px/document.getElementById('myMm').offsetHeight);
};

const DownloadPDF = ({label, tagType, download, downloading, downloadComplete}) => (
  <div>
    <div id="myMm" style={{height: "1mm"}} />
    <button className="btn-success"
      onClick={() => {
        // tag dimensions
        var tags = document.getElementsByClassName('qrtag');
        const TAG_WIDTH = pxToMm(tags[0].offsetWidth);
        const TAG_HEIGHT = pxToMm(tags[0].offsetHeight);

        // pdf page dimensions
        var pdf = (tagType === "Rfid") ?
          new jsPDF('p','mm',"credit-card") : // rfid/credit cards are 53x85
          new jsPDF();                        // defaults pp, mm, 210×297
        const PAGE_HEIGHT = pdf.internal.pageSize.getHeight();
        const PAGE_WIDTH = pdf.internal.pageSize.getWidth();
        const STARTING_WIDTH = (tagType === "Rfid") ? 2 : 10;
        const STARTING_HEIGHT = (tagType === "Rfid") ? 3 : 10;
        const WIDTH_INCREMENT = TAG_WIDTH + 5;
        const HEIGHT_INCREMENT = TAG_HEIGHT + 5;

        var runningHeight = STARTING_HEIGHT;
        var runningWidth = STARTING_WIDTH;

        download(); // set redux state.downloading = true
        let i = 0;
        function convertNextTag() {
          if (i > tags.length - 1) {
            pdf.save('qrcodes.pdf')
            downloadComplete() // set redux state.downloading = false
            return;
          }
          html2canvas(tags[i]).then((canvas) => {
            var imgData = canvas.toDataURL('image/png');

            pdf.addImage(
              imgData,
              'PNG',
              runningWidth,
              runningHeight,
              TAG_WIDTH,
              TAG_HEIGHT
            );

            runningWidth += WIDTH_INCREMENT;

            if (runningWidth + WIDTH_INCREMENT > PAGE_WIDTH) {
              runningWidth = STARTING_WIDTH;
              runningHeight += HEIGHT_INCREMENT;
            }
            if (runningHeight + HEIGHT_INCREMENT > PAGE_HEIGHT) {
              runningHeight = STARTING_HEIGHT;
              if (i < tags.length - 1) {
                pdf.addPage();
              }
            }

            i++
            convertNextTag()
          })
        }
        convertNextTag()
      }}
    >
      {!downloading && label}
      {downloading && <div>Downloading <i className="fa fa-spinner fa-pulse" /></div>}
    </button>
  </div>
);

const mapStateToProps = (state) => {
  return {
    tagType: state.tagType,
    downloading: state.downloading
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    download: () => {
      dispatch(download())
    },
    downloadComplete: () => {
      dispatch(downloadComplete())
    }
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(DownloadPDF);
