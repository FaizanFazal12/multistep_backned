const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const formSchema = new mongoose.Schema(
  {
    personal: {
      fullName: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
        // unique: true,
        lowercase: true,
        trim: true,
      },
      password: {
        type: String,
        required: true,
      },
      gender: {
        type: String,
        required: true,
      },
      dateOfBirth: {
        type: String,
        required: true,
      },
    },
    contact: {
      phoneNumber: {
        type: String,
        required: true,
        match: /^\+923[0-4][0-9]{8}$/,
      },
      alternatePhoneNumber: {
        type: String,
        required: false,
        match: /^\+923[0-4][0-9]{8}$/,
      
      },
      addressLine1: {
        type: String,
        required: true,
      },
      addressLine2: {
        type: String,
        required: false,
      
      },
      city: {
        type: String,
        required: true,
      },
      postalCode: {
        type: String,
        required: true,
      },
      country: {
        type: String,
        required: true,
      },
    },
    employment: {
      jobTitle: {
        type: String,
        required: true,
      },
      employmentStatus: {
        type: String,
        enum: ['Employed', 'Unemployed', 'Student'],
        required: true,
      },
      companyName: {
        type: String,
        required: false,
      
      },
      yearsOfExperience: {
        type: Number,
        required: true,
        min: 0,
      },
      resume: {
        type: String,
        required: false,
      },
    },
    financial: {
      monthlyIncome: {
        type: Number,
        required: true,
        min: 0,
      },
      loanStatus: {
        type: String,
        enum: ['Yes', 'No'],
        required: true,
      },
      loanAmount: {
        type: Number,
        required: false,
        min: 0,
        default: 0,
      },
      creditScore: {
        type: Number,
        required: true,
        min: 300,
        max: 850,
      },
    },
    preferences: {
      contactMode: {
        type: String,
        enum: ['Email', 'Phone', 'SMS'],
        required: true,
      },
      hobbies: {
        type: [String],
        required: false,
        default: [],
      },
      newsletter: {
        type: Boolean,
        required: false,
        default: false,
      },
    },
  },
  {
    timestamps: true,
  }
);

formSchema.pre('save', async function (next) {
  if (this.isModified('personal.password')) {
    this.personal.password = await bcrypt.hash(this.personal.password, 10);
  }
  next();
});

module.exports = mongoose.model('Form', formSchema);