import { Injectable } from '@angular/core';
import * as pdfjs from 'pdfjs-dist';


@Injectable({
  providedIn: 'root'
})
export class PdfService {

  constructor() { }
  
  async extractFirstPageAsImage(file: File): Promise<string | null> {
    return new Promise<string | null>((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.onload = async () => {
        const arrayBuffer = fileReader.result as ArrayBuffer;
        const typedArray = new Uint8Array(arrayBuffer);
        try {
          const pdf = await pdfjs.getDocument(typedArray).promise;
          const page = await pdf.getPage(1);
          const scale = 1.5; // Adjust the scale if needed
          const viewport = page.getViewport({ scale });
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          if (context) {
            canvas.height = viewport.height;
            canvas.width = viewport.width;
            const renderContext = {
              canvasContext: context,
              viewport: viewport
            };
            await page.render(renderContext).promise;
            const imageUrl = canvas.toDataURL('image/png');
            resolve(imageUrl);
          } else {
            reject(new Error('Failed to get canvas context'));
          }
        } catch (error) {
          reject(error);
        }
      };
      fileReader.onerror = () => {
        reject(new Error('Failed to read file'));
      };
      fileReader.readAsArrayBuffer(file);
    });
  }
}
