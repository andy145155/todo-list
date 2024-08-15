import { AppError } from "../../../src/utils/AppError";

describe("AppError", () => {
  it("should instantiate with a message and default status code", () => {
    const error = new AppError("Something went wrong");

    expect(error).toBeInstanceOf(AppError);
    expect(error.message).toBe("Something went wrong");
    expect(error.statusCode).toBe(500);
    expect(error.stack).toBeDefined();
  });

  it("should instantiate with a custom status code", () => {
    const error = new AppError("Not Found", 404);

    expect(error).toBeInstanceOf(AppError);
    expect(error.message).toBe("Not Found");
    expect(error.statusCode).toBe(404); // Custom status code
    expect(error.stack).toBeDefined();
  });

  it("should set the correct prototype chain", () => {
    const error = new AppError("Prototype test");

    // Ensure the prototype chain is restored
    expect(Object.getPrototypeOf(error)).toBe(AppError.prototype);
  });

  it("should capture the stack trace", () => {
    const error = new AppError("Stack trace test");

    // Ensure the stack trace is defined
    expect(error.stack).toContain("AppError");
  });
});
