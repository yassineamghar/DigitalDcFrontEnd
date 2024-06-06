export class User {
    constructor(
      public id: string,
      public userName: string,
      public email: string,
      public fullname: string,
      public dateCreated: Date,
      public emailConfirmed: boolean,
    ) {}
  }

  