export class workshop {
  constructor(
      public Id_Workshop: string,
      public Image_URL: string[],
      public Image_Name: string[],
      public Pdf_URL: string[],
      public Pdf_Name: string[],
      public Video_Name: string,
      public Video_URL: string,
      public DateCreated: Date,
      public Title: string,
      public Description: string
  ) {
      // Initialize arrays to ensure they are iterable
      // this.image_Name = image_Name || [];
      // this.pdf_Name = pdf_Name || [];
  }
}
