import { validateObjects } from "../utils/validateObjects.js";

export const validate = (schema, type) => (req, res, next) => {
  try {
    const dataToValidate = req[type];
    validateObjects(dataToValidate, schema);
    next();
  } catch (err) {
    res.status(400).json({ result: "error", message: err.message });
  }
};
