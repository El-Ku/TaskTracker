import Joi from 'joi';

const validate = (schema, type) => (req, res, next) => {
    const dataToValidate = req[type];
    let valResult;
    if(Array.isArray(dataToValidate)) {
        const taskArraySchema = Joi.array().items(schema);
        valResult = taskArraySchema.validate(dataToValidate);
    } else {
        valResult = schema.validate(dataToValidate);
    }
    if (valResult.error) {
        return res.status(400).json({ result: "error", message: valResult.error.details[0].message});
    }
    next();
};

export default validate;