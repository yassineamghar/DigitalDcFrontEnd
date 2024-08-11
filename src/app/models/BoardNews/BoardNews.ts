export class BoardNews {
  constructor(
    public Id: string,  // Change Id to Id_BN
    public Image_URL: string,
    public Image_Name: string,
    public DateCreated: Date,
    public Title: string,
    public Description: string,
  ) {}
}

