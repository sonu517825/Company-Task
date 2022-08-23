const assert = require("assert");
const multply = require("../Probloms/ques__1");

describe("test", () => {
  describe("multply", () => {
    it("equal 15", () => {
      let result = multply.getMultiplyStep(16, 10); // 160
      assert.equal(Number(result[result.length - 1]["step8"]["sum"]), 160);
    });
  });
});
