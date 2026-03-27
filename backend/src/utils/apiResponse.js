export const apiResponse = (res, success, message = '', data = null, status = 200) => {
  return res.status(status).json({
    success,
    message,
    data,
  });
};
