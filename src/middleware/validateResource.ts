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
      // TODO: Check by sending whole array / or just last part if it can correctly match the path to show error below the input field
      fieldName: e.path.at(-1), // get the last path
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
