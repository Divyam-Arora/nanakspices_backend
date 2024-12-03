class GlobalError extends Error {
  #status = 500;
  constructor(message: string, status?: number) {
    super(message);
    if (status) this.#status = status;

    return this;
  }

  public get message(): string {
    return this.message;
  }

  public get status(): number {
    return this.#status;
  }
}

export default GlobalError;
