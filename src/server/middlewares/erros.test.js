const { notFoundError, generalError } = require("./errors");

describe("Given a notFoundError middleware", () => {
  describe("When it receives a wrong request", () => {
    test("Then it should call the method json with an error", () => {
      const mockRes = () => {
        const res = {};
        res.status = jest.fn().mockReturnValue(res);
        res.json = jest.fn().mockReturnValue(res);
        return res;
      };

      const mockedRes = mockRes();

      notFoundError(null, mockedRes);

      expect(mockedRes.json).toHaveBeenCalled();
    });
  });
});

describe("Given a generalError function", () => {
  describe("When it receives an error with a message and status code, and a response", () => {
    test("Then it should call method json with an ", () => {
      const mockRes = () => {
        const res = {};
        res.status = jest.fn().mockReturnValue(res);
        res.json = jest.fn().mockReturnValue(res);
        return res;
      };

      const error = {
        message: "error",
        code: 500,
      };

      const mockedRes = mockRes();

      generalError(error, null, mockedRes, null);

      expect(mockedRes.json).toHaveBeenCalled();
    });
  });

  describe("When it receives an error without status and a response", () => {
    test("Then it should call method json", () => {
      const mockRes = () => {
        const res = {};
        res.status = jest.fn().mockReturnValue(res);
        res.json = jest.fn().mockReturnValue(res);
        return res;
      };

      const error = {
        message: "error",
        code: null,
      };

      const mockedRes = mockRes();

      generalError(error, null, mockedRes, null);

      expect(mockedRes.json).toHaveBeenCalled();
    });
  });
});
