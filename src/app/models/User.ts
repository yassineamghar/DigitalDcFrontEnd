export class User {
    constructor(
      public id: string,
      public username: string,
      public email: string,
      public fullname: string,
      public dateCreated: Date,
      public role: string,
      public emailConfirmed: boolean,
    ) {}
  }

  