import Joi from "joi";

export const membershipValidation = Joi.object({
    entrepriseName: Joi.string().trim().required().messages({
        'any.required': 'Sie müssen einen Unternehmensnamen eingeben.',
        'string.empty': 'Der Unternehmenname darf nicht leer sein.'
    }),
    firstName: Joi.string().trim().required().messages({
        'any.required': 'Sie müssen Ihren Vornamen eingeben.',
        'string.empty': 'Ihr Vorname darf nicht leer sein.'
    }),
    lastName: Joi.string().trim().required().messages({
        'any.required': 'Sie müssen Ihren Vornamen eingeben.',
        'string.empty': 'Ihr Nachname darf nicht leer sein.'
    }),
    phoneNumber: Joi.string().trim().required().messages({
        'any.required': 'Sie müssen Ihre Mobilfunknummer eingeben.',
        'string.empty': 'Ihre Mobilfunknummer darf nicht leer sein.'
    }),
    email: Joi.string().email().lowercase().trim().required().messages({
        'any.required': 'Sie müssen Ihre E-Mail-Adresse eingeben.',
        'string.empty': 'Ihre E-Mail Adresse darf nicht leer sein.'
    }),
    address: Joi.string().trim().required().messages({
        'any.required': 'Sie müssen Ihre Adresse eingeben.',
        'string.empty': 'Ihre Adresse darf nicht leer ein.'
    }),
    postalCode: Joi.string()
        .trim()
        .pattern(/^\d{5}$/)
        .required()
        .messages({
            'any.required': 'Sie müssen Ihre PLZ eingeben.',
            'string.empty': 'Ihre PLZ darf nicht leer sein.',
            'string.pattern.base': 'Die PLZ muss aus 5 Ziffern bestehen.'
    }),
    location: Joi.string().trim().required().messages({
        'any.required': 'Sie müssen Ihre Stadt eingeben.',
        'string.empty': 'Ihre Adresse darf nicht leer sein.'
    }),
    membershipFee: Joi.string().valid(
        "semiAnnually",
        "yearly",
        "invoice"
    ).required().messages({
        'any.required': 'Bitte wählen Sie einen Mitgliedsbeitrag aus.',
        'any.only': 'Die Auswahl für den Mitgliedsbeitrag ist ungültig. Bitte wählen Sie eine gültige Option aus.',
        'string.base': 'Die Auswahl für den Mitgliedsbeitrag muss ein Text sein.'
    }),
    iban: Joi.string().trim().required().messages({
        'any.required': 'Sie müssen Ihre IBAN eingeben.',
        'string.empty': 'Ihre IBAN darf nicht leer sein.'
    }),
    bic: Joi.string().trim().required().messages({
        'any.required': 'Sie müssen Ihre BIC eingeben.',
        'string.empty': 'Ihre BIC darf nicht leer sein.'
    })
});