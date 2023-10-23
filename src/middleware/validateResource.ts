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
      fieldName: e.path[1], // ['body/params/query', 'fieldName']
      message: e.message,
    }));

    return res.status(422).json({
      success: false,
      errors,
    });
  }
};
