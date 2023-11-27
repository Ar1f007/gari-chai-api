import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';

export const validateResource = (schema: AnyZodObject) => (req: Request, res: Response, next: NextFunction) => {
  try {
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });

    next();
  } catch (e: unknown) {
    if (!(e instanceof ZodError)) {
      throw e;
    }

    const errors = e.errors.map((e) => ({
      fieldName: e.path.slice(1), // remove first element "body" from path array
      message: e.message,
    }));

    const firstErrorMessage = e.issues[0].message;

    return res.status(422).json({
      status: 'validationError',
      message: firstErrorMessage,
      errors,
    });
  }
};
