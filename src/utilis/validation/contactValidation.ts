import Joi from 'joi';

export const contactValidation = Joi.object({
    name: Joi.string().required().messages({
        'any.required': 'Bitte geben Sie Ihren Namen ein.',
        'string.empty': 'Ihr Name darf nicht leer sein.'
    }),
    email: Joi.string().email().trim().lowercase().required().messages({
        'any.required': 'Bitte geben Sie Ihre E-Mail Adresse ein.',
        'string.empty': 'Ihre E-Mail Adresse darf nicht leer sein.',
        'string.email': 'Sie müssen eine gültige E-Mail Adresse eingeben.'
    }),
    message: Joi.string().required().messages({
        'any.required': 'Bitte geben Sie Ihre Nachricht ein.',
        'string.empty': 'Ihre Nachricht darf nicht leer sein.'
    })
});