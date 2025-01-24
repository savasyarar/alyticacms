import Joi from "joi";

export const newsValidation = Joi.object({
    title: Joi.string().trim().max(255).required().messages({
        'any.required': 'Sie müssen einen Titel angeben',
        'string.max': 'Sie dürfen nicht mehr als 255 Zeichen im Titel benutzen.'
    }),
    content: Joi.string().trim().max(5000).required().messages({
        'any.required': 'Sie müssen einen Inhalt eingeben',
        'string.max': 'Der Inhalt darf maximal 5000 Zeichen sein.'
    }),
    category: Joi.string().required().messages({
        'any.required': 'Sie müssen eine Kategorie angeben.'
    }),
    published: Joi.boolean().default(true).optional()
});