import Joi from "joi";

export const newsletterValidation = Joi.object({
   email: Joi.string().email().lowercase().trim().required().messages({
       'any.required': 'Sie müssen Ihre E-Mail Adresse angeben.',
       'string.email': 'Sie müssen eine gültige E-Mail Adresse angeben'
   })
});