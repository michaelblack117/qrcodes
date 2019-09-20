import React from 'react';
import { connect } from 'react-redux';
import { download, downloadComplete } from '../actions';
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
        const TITLE_FONT_SIZE = window.getComputedStyle(tags[0].getElementsByClassName('tag-title')[0]).fontSize.replace("px","");
        const ID_FONT_SIZE = window.getComputedStyle(tags[0].getElementsByClassName('tag-id')[0]).fontSize.replace("px","");
        const TEXT_FONT_SIZE = window.getComputedStyle(tags[0].getElementsByClassName('tag-text')[0]).fontSize.replace("px","");


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

        pdf.setFont("helvetica");
        //pdf.setLineHeightFactor(1);
        download(); // set redux state.downloading = true
        let i = 0;
        function convertNextTag() {
          if (i > tags.length - 1) {
            pdf.save('qrcodes.pdf')
            downloadComplete() // set redux state.downloading = false
            return;
          }
          // testing...
          var title = tags[i].getElementsByClassName("tag-title")[0]
          var qrcode = tags[i].getElementsByTagName("canvas")[0]
          var id = tags[i].getElementsByClassName("tag-id")[0]
          var text = tags[i].getElementsByClassName("tag-text")[0]

          pdf.setFontSize(TITLE_FONT_SIZE);
          pdf.text(
            title.innerText,
            runningWidth + (TAG_WIDTH / 2),
            runningHeight + pxToMm(title.offsetTop),
            "center"
          );

          var imgData = qrcode.toDataURL('image/png');

          pdf.addImage(
            imgData,
            'PNG',
            runningWidth + pxToMm(qrcode.offsetLeft),
            runningHeight + pxToMm(title.offsetTop) + 2,
            pxToMm(qrcode.offsetWidth),
            pxToMm(qrcode.offsetHeight)
          );

          pdf.setFillColor("#87cefa");
          pdf.roundedRect(
            runningWidth,
            runningHeight + pxToMm(id.offsetTop) - pxToMm(id.offsetHeight) + 1,
            pxToMm(id.offsetWidth),
            pxToMm(id.offsetHeight),
            2,
            2,
            "F"
          );

          pdf.setFontSize(ID_FONT_SIZE);
          pdf.text(
            id.innerText,
            runningWidth + (TAG_WIDTH / 2),
            runningHeight + pxToMm(id.offsetTop),
            "center"
          );

          pdf.setFontSize(TEXT_FONT_SIZE);
          pdf.text(
            text.innerText,
            runningWidth + (TAG_WIDTH / 2),
            runningHeight + pxToMm(text.offsetTop),
            "center"
          );
          // ...testing

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

/*
{
  ConsolasHex: ["Bold"],
  courier: ["normal", "bold", "italic", "bolditalic"],
  Courier: ["", "Bold", "Oblique", "BoldOblique"],
  helvetica: ["normal", "bold", "italic", "bolditalic"],
  Helvetica: ["", "Bold", "Oblique", "BoldOblique"],
  times: ["normal", "bold", "italic", "bolditalic"],
  Times: ["Roman", "Bold", "Oblique", "BoldOblique"],
  zapfdingbats: ["undefined"]
  Zapfdingbats: [""]
*/
