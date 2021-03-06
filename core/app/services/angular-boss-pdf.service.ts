import { Injectable } from '@angular/core';
import { PredefinedPageSize, PageOrientation } from 'pdfmake/interfaces';
import { PdfDefinition } from '../models/pdf';
import * as pdfMakeCore from 'pdfmake/build/pdfmake';
import * as pdfMakeFonts from 'pdfmake/build/vfs_fonts';
import { Table } from '../models/table';

@Injectable({
  providedIn: 'root',
})
export class AngularBossPdfService {
  pageSize: PredefinedPageSize = 'LETTER';
  pageOrientation: PageOrientation = 'portrait';
  documentDefinition: PdfDefinition;

  private pdfMake: any;

  private base64;

  constructor() {
    this.pdfMake = pdfMakeCore;
    this.pdfMake.vfs = pdfMakeFonts.pdfMake.vfs;
  }

  create() {
    if (this.documentDefinition) {
      this.destroy();
    }
    this.documentDefinition = new PdfDefinition();
  }

  destroy() {
    this.documentDefinition = null;
  }

  open() {
    this.pdfMake.createPdf(this.getPdfDefinition()).open();
  }

  print() {
    this.pdfMake.createPdf(this.getPdfDefinition()).print();
  }

  download(name?: string) {
    this.pdfMake.createPdf(this.getPdfDefinition()).download(name);
  }

  configureStyles(styles: any) {
    this.getPdfDefinition().styles = styles;
  }

  addText(text: string, style?: any | string, pageBreak?: string) {
    this.getPdfDefinition().content.push({
      text,
      style,
      pageBreak,
    });
  }

  addColumns(columnsText: string[]) {
    const columns = [];
    for (const column of columnsText) {
      columns.push({ text: column });
    }

    this.getPdfDefinition().content.push({ columns });
  }

  addTable(table: Table) {
    const body = [];

    if (table) {
      if (table.headers) {
        body.push(table.headers.get());
      }

      if (table.rows) {
        for (const row of table.rows) {
          body.push(row.get());
        }
      }

      this.getPdfDefinition().content.push({
        table: { widths: table.widths, body },
      });
    }
  }

  addImage(url: string, width?: number, height?: number) {
    const image = new Image();

    image.setAttribute('crossOrigin', 'anonymous');
    image.src = url;

    image.onload = () => {
      let canvas = document.createElement('canvas');
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;

      canvas.getContext('2d').drawImage(image, 0, 0);

      if (width && !height) {
        height = width;
      }

      const finalImage = {
        image: canvas.toDataURL('image/png'),
        width: width ? width : image.naturalWidth,
        height: height ? height : image.naturalHeight,
      };

      this.getPdfDefinition().content.push(finalImage);

      canvas = null;
    };
  }

  addUnorderedlist(items: any[]) {
    this.documentDefinition.content.push({ ul: items });
  }

  addOrderedList(items: any[], reversed = false, start?: number) {
    this.getPdfDefinition().content.push({
      reversed,
      start,
      ol: items,
    });
  }

  private getPdfDefinition() {
    if (this.documentDefinition) {
      return this.documentDefinition;
    } else {
      throw new Error(
        'The document isn\'t created! Please use the create()" method to create it before use it.'
      );
    }
  }
}
