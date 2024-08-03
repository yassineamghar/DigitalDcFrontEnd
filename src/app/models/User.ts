export class User {
    constructor(
      public Id: string,
      public UserName: string,
      public Email: string,
      public Fullname: string,
      public DateCreated: Date,
      public Role: string,
      public EmailConfirmed: boolean,
    ) {}
  }

  