const constants = {
  USER_FIRSTNAME: "Craig", // Enter firstname of Employee
  USER_LASTNAME: "Hunter", // Enter lastname of Employee
  USER_IMAGE:
    "https://i.pinimg.com/474x/cb/33/d8/cb33d80fe655e221ae05f41c8edd0cdb.jpg", // Enter image url of Employee's avatar or leave it blank
  USER_DOB: "12-12-1991", // Enter date of birth of Employee (e.g, 12-12-1991)
  USER_ROLE: "Admin", // Enter role of Employee (Admin or User)
  USER_EMAIL: "admin@flora.com", // Enter email of Employee
  USER_PASSWORD: "Abc123@", // Enter password of Employee (password must be at least 6 characters long and must have uppercase, lowercase and special case characters).
  USER_PHONE: "+1 123 123 1234", // Enter phone number of Employee
  USER_ADDRESS: "152 E 118th Street New York, New York, 10035", // Enter home address of Employee
  USER_CITY: "NYC", // Enter city of Employee
  USER_ZIPCODE: "10001", // Enter zipcode of Employee
  USER_STATE: "NY", // Enter state of Employee

  CHAIN_NAME: "Blue Sage", // Enter chain/company name
  CHAIN_ADDRESS: "New York", // Enter chain/company address
  CHAIN_PHONE: "12341234", // Enter phone number of chain/company
  CHAIN_LOGO: "", // Enter image url of chain/company's logo

  REGULATION_AGE: 21, // Enter age regulation/limit of store (e.g, 21)
  REGULATION_MEDICAL_ONLY: 1, // Enter medical only regulation of store (1:yes or 0:no)

  CORE_CITY_ID: 1, // Enter ID of core city (get it from coreDB => coreCity)
  STORE_AGE_LIMIT: 21, // Enter store name
  STORE_NAME: "Carthage", // Enter age limit of store
  STORE_PHONE: "+1 123 123", // Enter phone number of store
  STORE_ADDRESS: "CA", // Enter address of store
  STORE_LOCATION: null, // Enter pin location of store

  STATE_ID_TYPE_IDNAME: "Drivers License", // Enter document/ID name (e.g, Driver License, Passport, etc)
  STATE_ID_TYPE_IS_FIRSTNAME: true, // Enter Boolean to tell if firstname will be required in verifying the document
  STATE_ID_TYPE_IS_LASTNAME: true, // Enter Boolean to tell if lastname will be required in verifying the document
  STATE_ID_TYPE_IS_DOB: true, // Enter Boolean to tell if date of birth will be required in verifying the document
  STATE_ID_TYPE_IS_ADDRESS: true, // Enter Boolean to tell if address will be required in verifying the document
  STATE_ID_TYPE_IS_IDNUMBER: true, // Enter Boolean to tell if id number (e.g, passport number, etc) will be required in verifying the document
  STATE_ID_TYPE_IS_EXPIRYDATE: true, // Enter Boolean to tell if expiry date of scanned document will be required in verifying the document
  STATE_ID_TYPE_IS_ISSUEDATE: false, // Enter Boolean to tell if issue date of scanned document will be required in verifying the document
  STATE_ID_TYPE_IS_MEDICALNUMBER: false, // Enter Boolean to tell if medical number of scanned document will be required in verifying the document
  STATE_ID_TYPE_IS_INSURANCENUMBER: false, // Enter Boolean to tell if insurance number will be required in verifying the document
  STATE_ID_TYPE_IS_MRZ: false, // Enter Boolean to tell if MRZ number (comes on Passport) will be required in verifying the document

  OTP_EXPIRY_TIME_IN_MINS: 60, // Enter expiry time of Otp in minutes (e.g, 60)
  OTP_MESSAGE_TEMPLATE: `Welcome to Flora! Get personalized products for you with Flora AI while you wait.\nHere is your OTP code for 2FA login: {OTP_CODE}`, // Enter message template for OTP, make sure message should not contain more than 150 characters and add tag {OTP_CODE} in message to replace this tag by actual otp code on runtime. Example: Welcome to Flora! Get personalized products for you with Flora AI while you wait.\nHere is your OTP code for 2FA login: {OTP_CODE}
};

export default constants;
