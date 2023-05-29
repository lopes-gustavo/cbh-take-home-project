const { deterministicPartitionKey } = require("./dpk");

describe("deterministicPartitionKey", () => {

  describe("When no event is provided", () => {
    it("Returns the literal '0' when given no input", () => {
      const trivialKey = deterministicPartitionKey();
      expect(trivialKey).toBe("0");
    });
  });

  describe("When event.partitionKey is provided, but smaller than MAX_PARTITION_KEY_LENGTH", () => {
    it("Returns the same key if partitionKey is a string", () => {
      const trivialKey = deterministicPartitionKey({
        partitionKey: "test"
      });
      expect(trivialKey).toBe("test");
    });

    it("Returns a stringified version of the partitionKey if it's not a string (eg. number)", () => {
      const trivialKey = deterministicPartitionKey({
        partitionKey: 5
      });
      expect(trivialKey).toBe("5");
    });

    it("Returns a stringified version of the partitionKey if it's not a string (eg. object)", () => {
      const trivialKey = deterministicPartitionKey({
        partitionKey: {"anything": true}
      });
      expect(trivialKey).toBe("{\"anything\":true}");
    });
  })

  describe("When event.partitionKey is provided and bigger than MAX_PARTITION_KEY_LENGTH", () => {
    it("Returns the hash of the partitionKey", () => {
      const trivialKey = deterministicPartitionKey({
        partitionKey: 'x'.repeat(1024)
      });
      expect(trivialKey).toBe("0e750998788f4f65bcf698022e6c2e1fa7c01834e77d8ef272ad12ecf8a103c2df6180301af38faf681b81b728c506957bffe20585a747b16cefe7b9ce25aaf8");
    });
  });

  describe("When event.partitionKey is not provided", () => {
    it("Returns the hash of the event object itself (eg. Number)", () => {
      const trivialKey = deterministicPartitionKey(5);
      expect(trivialKey).toBe("c74bd95b8555275277d4e941c73985b4bcd923b36fcce75968ebb3c5a8d2b1ac411cfae4c2d473bff59a2b7b5ea220f0ac7bb8c880afb32f1b4881d59cc60d85");
    });

    it("Returns the hash of the event object itself (eg. Object)", () => {
      const trivialKey = deterministicPartitionKey({
        whatever: "test"
      });
      expect(trivialKey).toBe("e1ae4bdfb50185a64b3526cecb7d93d0736903ab12defaf24b5dcf088345882484db6896145a6f041f4794f346e0e6c6798414096cdf3fd7a6303c346d3d7f1c");
    });
  });

});
