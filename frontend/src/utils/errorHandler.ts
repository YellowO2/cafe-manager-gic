/**
 * Extracts user friendly error messages from API errors.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getErrorMessage = (error: any): string => {
  if (error.response?.data?.message) {
    const messages = error.response.data.message;
    const msg = Array.isArray(messages) ? messages.join(", ") : messages;

    // replace underscores with spaces
    return msg.replace(/_/g, " ");
  }

  return error.message?.replace(/_/g, " ") || "An unexpected error occurred";
};
