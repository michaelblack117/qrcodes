import React from 'react';
import { connect } from 'react-redux';
import { download, downloadComplete } from '../actions';
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf';
import './styles.css';

function heightByTagType(tagType) {
  switch (tagType) {
    case 'Sticker':
      return 40;
    case 'HolePunch':
      return 40;
    case 'Rfid':
      return 70;
    default:
      return 90;
  }
}
function widthByTagType(tagType) {
  switch (tagType) {
    case 'Sticker':
      return 35;
    case 'HolePunch':
      return 35;
    case 'Rfid':
      return 45;
    default:
      return 60;
  }
}
const DownloadButton = ({label, tagType, download, downloading, downloadComplete}) => (
  <div>
    <button
      onClick={() => {
        const STARTING_HEIGHT = 5;
        const STARTING_WIDTH = 3;
        const HEIGHT_INCREMENT = heightByTagType(tagType);
        const WIDTH_INCREMENT = widthByTagType(tagType);

        var inputs = document.getElementsByClassName('qrtag');

        console.log(tagType);
        var pdf = (tagType === "Rfid") ?
          new jsPDF('p','mm',["170", "275"]) :
          new jsPDF();
        const PAGE_HEIGHT = pdf.internal.pageSize.getHeight();
        const PAGE_WIDTH = pdf.internal.pageSize.getWidth();
        var runningHeight = STARTING_HEIGHT;
        var runningWidth = STARTING_WIDTH;

        download();
        let i = 0;
        function convertNextTag() {
          if (i > inputs.length - 1) {
            pdf.save('qrcodes.pdf')
            downloadComplete()
            return;
          }
          html2canvas(inputs[i]).then((canvas) => {
            var imgData = canvas.toDataURL('image/png');

            pdf.addImage(imgData, 'PNG', runningWidth, runningHeight);
            runningWidth += WIDTH_INCREMENT;

            if (runningWidth + WIDTH_INCREMENT > PAGE_WIDTH) {
              runningWidth = STARTING_WIDTH;
              runningHeight += HEIGHT_INCREMENT;
            }
            if (runningHeight + HEIGHT_INCREMENT > PAGE_HEIGHT) {
              runningHeight = STARTING_HEIGHT;
              pdf.addPage();
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
export default connect(mapStateToProps, mapDispatchToProps)(DownloadButton);
