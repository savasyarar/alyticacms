import Joi from "joi";

const eventsValidation = Joi.object({
    name: Joi.string().trim().required().messages({
        'any.required': 'Bitte geben Sie einen Namen für Ihre Veranstaltung',
        'string.empty': 'Der Name der Veranstaltung darf nicht leer sein.'
    }),
    description: Joi.string().trim().required().messages({
        'any.required': 'Bitte geben Sie eine Beschreibung für Ihre Veranstaltung',
        'string.empty': 'Die Beschreibung der Veranstaltung darf nicht leer sein.',
    }),
    date: Joi.date().greater('now').required().messages({
        'any.required': 'Sie müssen einen Datum für Ihre Veranstaltung angeben.',
        'date.greater': 'Das Datum muss in der Zukunft liegen',
        'date.base': 'Bitte geben Sie ein gültiges Datum an.'
    })
});

export default eventsValidation;