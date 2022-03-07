const notFoundError = require("./errors");

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
