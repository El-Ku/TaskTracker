import Joi from "joi";

export const validateObjects = (data, schema) => {
  const schemaToUse = Array.isArray(data) ? Joi.array().items(schema) : schema;

  const result = schemaToUse.validate(data);
  if (result.error) {
    throw new Error(result.error.details[0].message);
  }
};
