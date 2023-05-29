const { deterministicPartitionKey } = require("./dpk");

describe("deterministicPartitionKey", () => {
  it("Returns the literal '0' when given no input", () => {
    const trivialKey = deterministicPartitionKey();
    expect(trivialKey).toBe("0");
  });

  describe("When event.partitionKey (PK) is provided, but smaller than MAX_PARTITION_KEY_LENGTH", () => {
    it("Returns the same key if PK is a string", () => {
      const trivialKey = deterministicPartitionKey({
        partitionKey: "test"
      });
      expect(trivialKey).toBe("test");
    });

    it("Returns a stringified version of the PK if it's not a string", () => {
      const trivialKey = deterministicPartitionKey({
        partitionKey: 5
      });
      expect(trivialKey).toBe("5");
    });

    it("Returns a stringified version of the PK if it's not a string", () => {
      const trivialKey = deterministicPartitionKey({
        partitionKey: {"anything": true}
      });
      expect(trivialKey).toBe("{\"anything\":true}");
    });
  })

  describe("When event.partitionKey (PK) is provided and bigger than MAX_PARTITION_KEY_LENGTH", () => {
    it("Returns the hash of the PK", () => {
      const trivialKey = deterministicPartitionKey({
        partitionKey: 'x'.repeat(1024)
      });
      expect(trivialKey).toBe("0e750998788f4f65bcf698022e6c2e1fa7c01834e77d8ef272ad12ecf8a103c2df6180301af38faf681b81b728c506957bffe20585a747b16cefe7b9ce25aaf8");
    });
  });

  describe("When event.partitionKey is not provided", () => {
    it("Returns the hash of the event", () => {
      const trivialKey = deterministicPartitionKey({
        whatever: "test"
      });
      expect(trivialKey).toBe("e1ae4bdfb50185a64b3526cecb7d93d0736903ab12defaf24b5dcf088345882484db6896145a6f041f4794f346e0e6c6798414096cdf3fd7a6303c346d3d7f1c");
    });
  });

});
