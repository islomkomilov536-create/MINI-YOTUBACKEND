import Joi from "joi";

const registerSchema=Joi.object({
 name:Joi.string().min(3).max(60).required().messages({
    "string.empty":"ism kiritlishi shart",
    "string.min":"ism kamida 3 harfdan iborat bolishi kerak",
    "string.max":"ism kamida 60 harfdan iborat bolishi kerak",
    "any.required":"ism kiritilishi shart"
 }),
 email:Joi.string().min(3).max(100).lowercase().required().messages({
    "string.emty":"email matn  bo'lishi kerak",
    "string.min":"email kiritilishi shart",
    "string.min":"email kamida 3 belginda iborat bolsihi shart",
    "string.max":"email 100 ta belgidan oshmasilig kerak",
    "any.required":"email kiritilishi shart",
}),
password:Joi.string().min(5).max(100).required().messages({
    "string.base":"parol mant bolishi kerak",
    "string.min":"parol kamida 5 ta belgidan  iborat bolishi kerak",
    "string.max":"Parol maskismal 100 belgifan iborat bolishi kerak",
    "any.required":"parol kiritilishi shart",
}),
});

const LoginSchema = Joi.object({
  email: Joi.string().trim().lowercase().required().messages({
    "string.base": "Email matn bo'lishi kerak",
    "string.empty": "Email kiritilishi shart",
    "any.required": "Email kiritilishi shart",
  }),
  password: Joi.string().required().messages({
    "string.base": "Parol matn bo'lishi kerak",
    "string.empty": "Parol kiritilishi shart",
    "any.required": "Parol kiritilishi shart",
  }),
});
const VideoSchema=Joi.object({
  title: Joi.string().min(3).max(100).required(),
  description: Joi.string().max(1000).allow("").optional(),
  videoUrl: Joi.string().uri().required(),
});
 const CommentSchema = Joi.object({
  text: Joi.string().trim().min(1).max(500).required(),
});


export {registerSchema,LoginSchema,VideoSchema,CommentSchema}