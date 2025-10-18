import { ZodError } from 'zod';

export function validateBody(schema) {
  return (req, res, next) => {
    try {
      const parsed = schema.parse(req.body);
      req.body = parsed;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(422).json({
          message: 'Invalid input',
          errors: error.errors.map((issue) => ({
            path: issue.path.join('.'),
            message: issue.message
          }))
        });
      }
      return next(error);
    }
  };
}
