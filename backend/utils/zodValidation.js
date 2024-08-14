const { z } = require('zod');

const userSchema = z.object({
  username: z.string().min(3, { message: 'Username must be at least 3 characters long' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters long' }),
});
const usernameSchema = userSchema.pick({ username: true });

const passwordSchema = userSchema.pick({ password: true });

module.exports = { userSchema, usernameSchema, passwordSchema };
