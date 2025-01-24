// @ import
import Joi from "joi";

export const userValidation = Joi.object({
    firstName: Joi.string().trim().required().messages({
        'any.required': 'Sie müssen einen Vornamen eingeben.'
    }),
    lastName: Joi.string().trim().required().messages({
        'any.required': 'Sie müssen einen Nachnamen eingeben.'
    }),
    email: Joi.string().email().trim().lowercase().required().messages({
        'any.required': 'Sie müssen eine E-Mail Adresse eingeben.',
        'string.email': 'Sie müssen eine gültige E-Mail Adresse eingeben.'
    }),
    password: Joi.string().required().pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
        .messages({
        'any.required': 'Sie müssen ein gültiges Passwort eingeben.',
        'string.pattern.base': 'Das Passwort muss mindestens 8 Zeichen haben.'
    }),
    retryPassword: Joi.string().valid(Joi.ref('password')).required().messages({
        'any.required': 'Sie müssen ein gültiges Passwort eingeben',
        'any.only': 'Die Passwörter stimmen nicht überein.'
    }),
    role: Joi.string().valid(
        'standard',
        'editor',
        'contentManager',
        'administrator'
    ).required().messages({
        'any.required': 'Sie müssen eine Benutzerrolle eingeben',
        'any.only': 'Ihre ausgewählte Benutzerrolle ist nicht valide.'
    })
});