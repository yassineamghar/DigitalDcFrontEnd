export class workshop {
  constructor(
      public id_Workshop: string,
      public image_URL: string[],
      public image_Name: string[],
      public pdf_URL: string[],
      public pdf_Name: string[],
      public video_Name: string,
      public video_URL: string,
      public dateCreated: Date,
      public title: string,
      public description: string
  ) {
      // Initialize arrays to ensure they are iterable
      // this.image_Name = image_Name || [];
      // this.pdf_Name = pdf_Name || [];
  }
}
