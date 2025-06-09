class ApiResponse {
  constructor(statuscode, message="Success", data) {
    this.statuscode = statuscode;
    this.message = message;
    this.data = data;
    this.success = statuscode < 400; // Assuming status codes below 400 are successful
  }


}
export { ApiResponse };