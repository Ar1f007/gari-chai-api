import express from 'express';
import { validateResource } from '../../middleware';
import { vehicleTypeCreateSchema } from './schema';
import { createVehicleBodyHandler } from './controller';

const vehicleBodyTypeRouter = express.Router();

vehicleBodyTypeRouter.route('/body-types').post(validateResource(vehicleTypeCreateSchema), createVehicleBodyHandler);

export default vehicleBodyTypeRouter;
