class ApiResponse {
  /**
   * Standardized success response
   */
  static success(res, data = null, message = "Operation completed successfully", status = 200, extra = {}) {
    return res.status(status).json({
      success: true,
      status: "success",
      message,
      data,
      ...extra
    });
  }

  /**
   * Standardized error response
   */
  static error(res, message = "Something went wrong", status = 500, errors = []) {
    return res.status(status).json({
      success: false,
      status: "failed",
      message,
      errors: Array.isArray(errors) ? errors : (errors ? [errors] : [])
    });
  }
}

export default ApiResponse;
