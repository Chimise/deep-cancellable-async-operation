import { asyncRoutine } from "./async-routine.js";
import { createCancelable, createToken } from "./cancellable.js";
import { CancelError } from "./cancel-error.js";


const token = createToken();

const cancelable2 = createCancelable(function* (signal, args) {
    const resA = yield asyncRoutine("D");
    console.log(resA);
    const resB = yield asyncRoutine("E");
    console.log(resB);
    const resC = yield asyncRoutine("F");
    return resC;
  });



const cancelable = createCancelable(function* (signal, args) {
    const resA = yield asyncRoutine("A");
    console.log(resA);
    const resD = yield cancelable2(signal, args);
    console.log(resD);
    const resB = yield asyncRoutine("B");
    console.log(resB);
    const resC = yield asyncRoutine("C");
    console.log(resC);
    
  });

  cancelable(token, 'Hello World').catch((err) => {
    if (err instanceof CancelError) {
      console.log("Function canceled");
      console.log(err);
    } else {
      console.error(err);
    }
  });

  setTimeout(() => {
    token.abort("An error occured");
  }, 200);


