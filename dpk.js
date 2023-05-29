const crypto = require("crypto");

const TRIVIAL_PARTITION_KEY = "0";
const MAX_PARTITION_KEY_LENGTH = 256;
const HASH_ALGORITHM = "sha3-512";
const HASH_ENCODING = "hex";

function deterministicPartitionKey(event) {
  if (!event) {
    return TRIVIAL_PARTITION_KEY;
  }

  const partitionKey = event.partitionKey;

  // If the event doesn't have a partition key, then return the hash directly.
  // This is only possible when the algorithm produces a hash bigger than the MAX_PARTITION_KEY_LENGTH
  if (!partitionKey) {
    const data = JSON.stringify(event);
    return createHash(data);
  }

  const candidate = typeof partitionKey === "string" ? partitionKey : JSON.stringify(partitionKey);

  return candidate.length > MAX_PARTITION_KEY_LENGTH ? createHash(candidate) : candidate;
}

function createHash(data) {
  return crypto.createHash(HASH_ALGORITHM).update(data).digest(HASH_ENCODING);
}

module.exports = { deterministicPartitionKey };