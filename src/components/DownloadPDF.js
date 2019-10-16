import React from 'react';
import { connect } from 'react-redux';
import { download, downloadComplete } from '../actions';
import jsPDF from 'jspdf';
import './styles.css';

const pxToMm = (px) => {
  return Math.floor(px/document.getElementById('myMm').offsetHeight);
};

async function postData(url = '', data = {}) {
  const response = await fetch(url, {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json'
      },
      redirect: 'follow',
      referrer: 'no-referrer',
      body: JSON.stringify(data)
    });
  return await response.json();
}

const DownloadPDF = ({url, label, tagType, download, downloading, downloadComplete}) => (
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
        // TODO: change page dimensions for stickers as a 12 X 18
        var pdf = (tagType === "Rfid") ?
          new jsPDF('p','mm',"credit-card") : // rfid/credit cards are 53x85
          new jsPDF();                        // defaults pp, mm, 210×297
        const PAGE_HEIGHT = pdf.internal.pageSize.getHeight();
        const PAGE_WIDTH = pdf.internal.pageSize.getWidth();
        const STARTING_WIDTH = (tagType === "Rfid") ? 2 : 10;
        const STARTING_HEIGHT = 10;
        const WIDTH_INCREMENT = TAG_WIDTH + 5;
        const HEIGHT_INCREMENT = TAG_HEIGHT + 5;

        // to keep track of the pdf x and y coordinates to write to
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

          // grab the text elements and canvas of the tag
          var title = tags[i].getElementsByClassName("tag-title")[0]
          var report = tags[i].getElementsByClassName("tag-report")
          var qrcode = tags[i].getElementsByTagName("canvas")[0]
          var id = tags[i].getElementsByClassName("tag-id")[0]
          var text = tags[i].getElementsByClassName("tag-text")

          // write the title of the tag to the pdf
          pdf.setTextColor(0); // black text color
          pdf.setFontStyle("bold");
          pdf.setFontSize(TITLE_FONT_SIZE);
          pdf.text(
            title.innerText,
            runningWidth + (TAG_WIDTH / 2),
            runningHeight + pxToMm(title.offsetTop),
            "center"
          );
          pdf.setFontStyle("normal")

          if (report[0]) {
            pdf.setFontSize(10)
            pdf.text(
              report[0].innerText,
              runningWidth + (TAG_WIDTH / 2),
              runningHeight + pxToMm(title.offsetTop) + 5,
              "center"
            );
          }

          // convert the canvas to image data .png specifically
          var imgData = qrcode.toDataURL('image/png');

          // add the qrcode to the pdf
          pdf.addImage(
            imgData,
            'PNG',
            runningWidth + pxToMm(qrcode.offsetLeft),
            runningHeight + pxToMm(title.offsetTop) + (report[0] ? 8 : 2),
            pxToMm(qrcode.offsetWidth),
            pxToMm(qrcode.offsetHeight)
          );

          // add the rounded background for the id
          pdf.setFillColor("#87cefa"); // root pico blue
          pdf.roundedRect(
            runningWidth,
            runningHeight + pxToMm(id.offsetTop) - pxToMm(id.offsetHeight) + 1,
            TAG_WIDTH,
            pxToMm(id.offsetHeight),
            2,
            2,
            "F"
          );

          // add the id of the tag to the pdf
          pdf.setFontStyle("bold")
          pdf.setFontSize(ID_FONT_SIZE);
          pdf.text(
            id.innerText,
            runningWidth + (TAG_WIDTH / 2),
            runningHeight + pxToMm(id.offsetTop),
            "center"
          );
          pdf.setFontStyle("normal")

          // add the text below to the tag
          pdf.setFontSize(TEXT_FONT_SIZE);
          pdf.text(
            text[0].innerText,
            runningWidth + (TAG_WIDTH / 2),
            runningHeight + pxToMm(text[0].offsetTop),
            "center"
          );

          // add extra text if the tag was big enough to have more text
          if (text[1]) {
            pdf.setTextColor("#87cefa") // root pico blue
            pdf.text(
              text[1].innerText,
              runningWidth + (TAG_WIDTH / 2),
              runningHeight + pxToMm(text[1].offsetTop),
              "center"
            );
            if (text[2]) {
              pdf.setTextColor(0)
              pdf.setFontStyle("bold")
              pdf.text(
                text[2].innerText,
                runningWidth + (TAG_WIDTH / 2),
                runningHeight + pxToMm(text[2].offsetTop),
                "center"
              );
              pdf.setFontStyle("normal")
            }
          }

          // update x coordinate to the next tag space
          runningWidth += WIDTH_INCREMENT;

          // if we exceed the page width
          // update y coordinate to next row and reset x coordinate
          if (runningWidth + WIDTH_INCREMENT > PAGE_WIDTH) {
            runningWidth = STARTING_WIDTH;
            runningHeight += HEIGHT_INCREMENT;
          }
          // new page if we exceed the height of the pdf
          if (runningHeight + HEIGHT_INCREMENT > PAGE_HEIGHT) {
            runningHeight = STARTING_HEIGHT;
            if (i < tags.length - 1) {
              pdf.addPage();
            }
          }

          // update database with tag code
          try {
            postData(
              "https://manifold.picolabs.io:9090/sky/event/VPa1BfnbD1DK9eJWzaszXb/qrcode_update/wrangler/ds_update",
              {
                domain: url,
                key: id.innerText,
                value: id.innerText
              }
            );
          } catch (error) {
            console.error(error);
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
    url: state.url,
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
