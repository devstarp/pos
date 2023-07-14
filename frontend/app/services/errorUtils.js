export function getGeneralErrorMessages(error) {
  let message = '';
  if (error) {
    if (typeof (error) === 'string') return error;
    try {
      Object.keys(error).map((key) => {
        const item = error[key];
        message = message + '\n' + item.map(i => i);
      });
    } catch (exception) {
      message = error.message; 
    }
  }
  return message;
}

export function get400ErrorMessages(error) {
  let message = '';
  if (typeof (error) === 'string') return error;
  Object.keys(error).map((key) => {
    const item = error[key];
    message = message + (message ? '\r\n' : '') + key + ': ' + item.map(i => i);
  });
  return message;
}
