# Refactoring

You've been asked to refactor the function `deterministicPartitionKey` in [`dpk.js`](dpk.js) to make it easier to read and understand without changing its functionality. For this task, you should:

1. Write unit tests to cover the existing functionality and ensure that your refactor doesn't break it. We typically use `jest`, but if you have another library you prefer, feel free to use it.
2. Refactor the function to be as "clean" and "readable" as possible. There are many valid ways to define those words - use your own personal definitions, but be prepared to defend them. Note that we do like to use the latest JS language features when applicable.
3. Write up a brief (~1 paragraph) explanation of why you made the choices you did and why specifically your version is more "readable" than the original.

You will be graded on the exhaustiveness and quality of your unit tests, the depth of your refactor, and the level of insight into your thought process provided by the written explanation.

## Your Explanation Here

A few things were modified:
- Isolated constants
  - Useful because the function doesn't need to call it every time. Also, it's best practices to group all the constants for better visibility.
- Encapsulated hash creation function
  - Useful because the hash itself is a complex operation, so it's easier to manage and not to break (few people will touch that function, for example)
  - It was repeated in the code
- Change the order of the "ifs" (guard clause)
  - This makes it simpler to read, because we can eliminate one indentation level
- Use a few ternaries
  - Makes the code simpler to read (when the clause is simple) and smaller in size


Apart from that, the biggest change was altering the implementation to make the code easier to read.

But that comes with a cost. Now the code is tied to the algorithm and MAX_PARTITION_KEY_LENGTH, 
where the algorithm output must be smaller than the MAX_PARTITION_KEY_LENGTH.

This change must be well documented because it can break the application if the constants are changed inadvertently.
Another possible solution is developed in dpk2.js, that being more complex to read because we need an additional 
variable to control the flow.
