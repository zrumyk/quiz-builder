class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }

  static NotFound(message: string) {
    return new ApiError(404, message);
  }
}

export default ApiError;
