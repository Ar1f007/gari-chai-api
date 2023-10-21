import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';

const validate = (schema: AnyZodObject) => (req: Request, res: Response, next: NextFunction) => {
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
      fieldName: e.path,
      message: e.message,
    }));

    return res.status(422).json({
      success: false,
      errors,
    });
  }
};

export default validate;
