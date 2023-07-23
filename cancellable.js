import { CancelError } from "./cancel-error.js";

export const createToken = () => {
  return new AbortController();
}


export const createCancelable = (generatorFunc) => {
  const cancelable = (token, ...args) => {
    let signal;
    if(token instanceof AbortController) {
      signal = token.signal;
    }else if(token instanceof AbortSignal) {
      signal = token;
    }else {
      return Promise.reject(new Error('Invalid args'));
    }

    const generator = generatorFunc(signal, ...args);
    const promise = new Promise((res, rej) => {

      async function nextStep(prevResult) {
        if (signal.aborted) {
          return rej(new CancelError(signal.reason));
        }

        if (prevResult.done) {
          return res(prevResult.value);
        }

        try {
          nextStep(generator.next(await prevResult.value));
        } catch (err) {
          try {
            nextStep(generator.throw(err));
          } catch (err2) {
            rej(err2);
          }
        }
      }

      nextStep({});
    });

    return promise;
  };

  return cancelable;
};

