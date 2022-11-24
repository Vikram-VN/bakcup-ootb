const {EOL} = require('os');

/**
 * Creates an Error object on which the number of elements specified have been
 * removed from the error's stack trace.
 *
 * The purpose is to provide a better feedback about the location in the code
 * where an error condition was observed.
 *
 * @class      PopStackError (name)
 * @param      {string}  message    The error message.
 * @param      {number}  [count=2]  The number of elements to remove from the stack trace. The default value is two to account for this method and its caller.
 * @return     {Error}   The new adjusted object.
 */
function PopStackError(message, count = 2) {
  if (typeof message !== 'string') {
    throw new Error(`Type of first argument ('${typeof message}') is not 'string'`);
  }
  if (typeof count !== 'number') {
    throw new Error(`Type of second argument ('${typeof count}') is not 'number'`);
  }
  const error = new Error(message);
  // Remove this code and its caller from the stack trace for a more helpful error message.
  const stack = error.stack.split(EOL);
  stack.splice(1, count);
  error.stack = stack.join(EOL);

  return error;
}

module.exports = {PopStackError};
