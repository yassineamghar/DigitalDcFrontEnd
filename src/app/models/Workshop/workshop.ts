export class workshop {
    constructor(
      public id_Workshop: string,
      public image_URL: string,
      public image_Name: string,
      public pdf_URL: string,
      public pdf_Name: string,
      public dateCreated: Date,
      public title: string,
      public description: string,
    ) {}
  }