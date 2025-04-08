export interface IUserProperty {
  // Define the properties of a Property object as per your schema
  // For example:
  Id: number;
  Name: string;
  // Add other relevant fields
}

export interface IAuthUserResponse {
  Id: string;
  Email: string;
  Roles: string[];
  Permissions: string[];
  Properties: any[];
  ActiveProperty?: any; // Optional if there may not be any active properties
  Extension?: any; // Optional if there may not be any extension
}
