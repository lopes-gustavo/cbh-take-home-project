const crypto = require("crypto");

const TRIVIAL_PARTITION_KEY = "0";
const MAX_PARTITION_KEY_LENGTH = 256;
const HASH_ALGORITHM = "sha3-512";
const HASH_ENCODING = "hex";

function deterministicPartitionKey(event) {
  if (!event) {
    return TRIVIAL_PARTITION_KEY;
  }

  // If the event doesn't have a partition key, then return the hash directly
  if (!event.partitionKey) {
    const data = JSON.stringify(event);
    return createHash(data);
  }

  let candidate = event.partitionKey;

  if (typeof candidate !== "string") {
    candidate = JSON.stringify(candidate);
  }

  if (candidate.length > MAX_PARTITION_KEY_LENGTH) {
    candidate = createHash(candidate);
  }

  return candidate;
}

function createHash(data) {
  return crypto.createHash(HASH_ALGORITHM).update(data).digest(HASH_ENCODING);
}

module.exports = { deterministicPartitionKey };