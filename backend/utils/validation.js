const { z } = require('zod');

const userSchema = z.object({
  username: z.string()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username cannot exceed 30 characters')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, underscores, and hyphens'),
    
  password: z.string()
    .min(6, 'Password must be at least 6 characters')
    .max(100, 'Password cannot exceed 100 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number'),
    
  firstname: z.string()
    .min(1, 'First name is required')
    .max(50, 'First name cannot exceed 50 characters')
    .trim(),
    
  lastname: z.string()
    .min(1, 'Last name is required')
    .max(50, 'Last name cannot exceed 50 characters')
    .trim(),
    
  role: z.enum(['student', 'teacher', 'admin'], {
    required_error: 'Role is required',
    invalid_type_error: 'Role must be either student, teacher, or admin'
  })
});

const validateRegister = async (req, res, next) => {
  // Log incoming request data
  console.log('Registration request body:', JSON.stringify(req.body, null, 2));
  
  try {
    // Check if all required fields are present
    const requiredFields = ['username', 'password', 'firstname', 'lastname', 'role'];
    const missingFields = requiredFields.filter(field => !(field in req.body));
    
    if (missingFields.length > 0) {
      const errorResponse = {
        status: 'error',
        message: 'Missing required fields',
        errors: missingFields.map(field => ({
          field,
          message: `${field} is required`
        })),
        timestamp: new Date().toISOString()
      };
      
      console.log('Validation failed - Missing fields:', errorResponse);
      return res.status(400).json(errorResponse);
    }

    // Validate the request body against the schema
    const result = userSchema.safeParse(req.body);
    
    if (!result.success) {
      const errors = result.error.errors.map(error => ({
        field: error.path.join('.'),
        message: error.message
      }));
      
      const errorResponse = {
        status: 'error',
        message: 'Validation failed',
        errors,
        details: errors.map(e => `${e.field}: ${e.message}`).join(', '),
        timestamp: new Date().toISOString()
      };
      
      console.log('Validation failed - Schema validation:', errorResponse);
      return res.status(400).json(errorResponse);
    }
    
    // Trim whitespace from string fields
    req.body.firstname = req.body.firstname.trim();
    req.body.lastname = req.body.lastname.trim();
    req.body.username = req.body.username.trim();
    
    // Log successful validation
    console.log('Validation successful - Processed data:', {
      ...result.data,
      password: '[REDACTED]' // Don't log passwords
    });
    
    // Add validated data to request
    req.validatedData = result.data;
    next();
    
  } catch (error) {
    console.error('Unexpected validation error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'An error occurred during validation',
      details: error.message,
      timestamp: new Date().toISOString()
    });
  }
};

module.exports = {
  userSchema,
  validateRegister
};