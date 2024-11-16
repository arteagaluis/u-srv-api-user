import userModel from '../models/user.model.js';

// Función de servicio para agregar un dispositivo
export const addDevice = async (email, deviceData) => {
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      throw new Error('Usuario no encontrado');
    }
    user.devices.push(deviceData);
    await user.save();
    return user.devices; // Retorna los dispositivos actualizados
  } catch (error) {
    throw new Error(error.message);
  }
};

// Controlador para manejar la solicitud HTTP
export const addDeviceController = async (req, res) => {
  try {
    const devices = await addDevice(req.params.email, req.body);
    res.status(201).json(devices);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const listDevices = async (email) => {
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      throw new Error('Usuario no encontrado');
    }
    return user.devices; // Retorna la lista de dispositivos
  } catch (error) {
    throw new Error(error.message);
  }
};

export const listDevicesController = async (req, res) => {
  try {
    const devices = await listDevices(req.params.email, req.body);
    res.status(201).json(devices);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
