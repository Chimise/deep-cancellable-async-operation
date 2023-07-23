
export class CancelError extends Error {
    constructor (err) {
      super(err)
      this.isCanceled = true
    }
  }
  