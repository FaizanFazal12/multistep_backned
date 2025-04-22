const Joi = require('joi');

// Base schemas for nested objects
const personalSchema = Joi.object({
  fullName: Joi.string().min(1).required().messages({
    'string.empty': 'Full Name is required',
    'any.required': 'Full Name is required',
  }),
  email: Joi.string().email().lowercase().required().messages({
    'string.email': 'Invalid email address',
    'any.required': 'Email is required',
  }),
  password: Joi.string()
    .min(8)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]+$/)
    .required()
    .messages({
      'string.min': 'Password must be at least 8 characters',
      'string.pattern.base':
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
      'any.required': 'Password is required',
    }),
  confirmPassword: Joi.string().optional(), // Validated in frontend, not stored
  gender: Joi.string().valid('Male', 'Female', 'Other').required().messages({
    'any.only': 'Gender must be Male, Female, or Other',
    'any.required': 'Gender is required',
  }),
  dateOfBirth: Joi.string().isoDate().required().messages({
    'string.isoDate': 'Date of Birth must be a valid ISO date (e.g., YYYY-MM-DD)',
    'any.required': 'Date of Birth is required',
  }),
});

const contactSchema = Joi.object({
  phoneNumber: Joi.string()
    .pattern(/^\+923[0-4][0-9]{8}$/)
    .required()
    .messages({
      'string.pattern.base': 'Phone Number must be a valid Pakistan number (e.g., +923001234567)',
      'any.required': 'Phone Number is required',
    }),
  alternatePhoneNumber: Joi.string()
    .pattern(/^\+923[0-4][0-9]{8}$/)
    .optional()
    .messages({
      'string.pattern.base': 'Alternate Phone Number must be a valid Pakistan number (e.g., +923001234567)',
    }),
  addressLine1: Joi.string().min(1).required().messages({
    'string.empty': 'Address Line 1 is required',
    'any.required': 'Address Line 1 is required',
  }),
  addressLine2: Joi.optional(),
  city: Joi.string().min(1).required().messages({
    'string.empty': 'City is required',
    'any.required': 'City is required',
  }),
  postalCode: Joi.string().min(1).required().messages({
    'string.empty': 'Postal Code is required',
    'any.required': 'Postal Code is required',
  }),
  country: Joi.string().min(1).required().messages({
    'string.empty': 'Country is required',
    'any.required': 'Country is required',
  }),
});

const employmentSchema = Joi.object({
  jobTitle: Joi.string().min(1).required().messages({
    'string.empty': 'Job Title is required',
    'any.required': 'Job Title is required',
  }),
  resume: Joi.string().optional(), 
  employmentStatus: Joi.string()
    .valid('Employed', 'Unemployed', 'Student')
    .required()
    .messages({
      'any.only': 'Employment Status must be Employed, Unemployed, or Student',
      'any.required': 'Employment Status is required',
    }),
  companyName: Joi.string().when('employmentStatus', {
    is: 'Employed',
    then: Joi.string().min(1).required().messages({
      'string.empty': 'Company Name is required when Employed',
      'any.required': 'Company Name is required when Employed',
    }),
    otherwise: Joi.string().optional(),
  }),
  yearsOfExperience: Joi.number().min(0).required().messages({
    'number.min': 'Years of Experience cannot be negative',
    'any.required': 'Years of Experience is required',
  }),
  // resume validated by multer
});

const financialSchema = Joi.object({
  monthlyIncome: Joi.number().min(0).required().messages({
    'number.min': 'Monthly Income cannot be negative',
    'any.required': 'Monthly Income is required',
  }),
  loanStatus: Joi.string().valid('Yes', 'No').required().messages({
    'any.only': 'Loan Status must be Yes or No',
    'any.required': 'Loan Status is required',
  }),
  loanAmount: Joi.number().when('loanStatus', {
    is: 'Yes',
    then: Joi.number().min(0).required().messages({
      'number.min': 'Loan Amount cannot be negative',
      'any.required': 'Loan Amount is required when Loan Status is Yes',
    }),
    otherwise: Joi.number().min(0).optional(),
  }),
  creditScore: Joi.number().min(300).max(850).required().messages({
    'number.min': 'Credit Score must be at least 300',
    'number.max': 'Credit Score cannot exceed 850',
    'any.required': 'Credit Score is required',
  }),
});

const preferencesSchema = Joi.object({
  contactMode: Joi.string().valid('Email', 'Phone', 'SMS').required().messages({
    'any.only': 'Preferred Mode of Contact must be Email, Phone, or SMS',
    'any.required': 'Preferred Mode of Contact is required',
  }),
  hobbies: Joi.array().items(Joi.string()).optional(),
  newsletter: Joi.boolean().optional(),
});

const createSchema = Joi.object({
  personal: personalSchema.required(),
  contact: contactSchema.required(),
  employment: employmentSchema.required(),
  financial: financialSchema.required(),
  preferences: preferencesSchema.required(),
});

const editSchema = Joi.object({
  personal: personalSchema.optional(),
  contact: contactSchema.optional(),
  employment: employmentSchema.optional(),
  financial: financialSchema.optional(),
  preferences: preferencesSchema.optional(),
}).min(1); // At least one section must be provided

module.exports = { createSchema, editSchema };