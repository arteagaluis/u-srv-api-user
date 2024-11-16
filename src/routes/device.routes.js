import { Router } from 'express';
import {
  addDeviceController,
  listDevicesController,
} from '../controllers/device.controller.js';

const router = Router();

router.post('/users/:email/devices', addDeviceController);

router.get('/users/:email/devices', listDevicesController);

export default router;
