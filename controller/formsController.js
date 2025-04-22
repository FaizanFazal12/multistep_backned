
const Form = require('../model/Form');
const fs = require('fs').promises;
const { createSchema, editSchema } = require('../validation/form');

const formsController = {
  async create(req, res, next) {
    try {
      const { data: body } = req.body;
      const data = JSON.parse(body)
      const resumeFile = req.file;

      // Validate with Joi
      const { error } = createSchema.validate(data);
      if (error) {
        return next(error);
      }

      // let findExistingEmail = await Form.findOne({ email: data.personal.email })
      // if(!findExistingEmail){
      //   return next({ status: 400, message: 'Email is Already Found' });
      // }

      const formData = {
        personal: data.personal,
        contact: data.contact,
        employment: {
          ...data.employment,
          resume: resumeFile ? resumeFile.path : undefined,
        },
        financial: data.financial,
        preferences: data.preferences,
      };

      if (!formData.employment.resume) {
        return next({ status: 400, message: 'Resume file is required' });
      }

      const form = new Form(formData);
      await form.save();

      return res.status(201).json({ form, success: true });
    } catch (error) {
      return next(error);
    }
  },

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const { data: body } = req.body;
      const data = JSON.parse(body);
      const resumeFile = req.file;

      const { error } = editSchema.validate(data);
      if (error) {
        return next(error);
      }

      if (resumeFile) {
        data.employment.resume = resumeFile.path;
      }

      console.log(data)

      const updatedForm = await Form.findOneAndUpdate(
        { _id: id },
        { $set:data },
        {
          new: true,
          upsert: true,
          runValidators: true,
        }
      );


      return res.status(200).json({ form: updatedForm, success: true });
    } catch (error) {
      return next(error);
    }
  },



  async delete(req, res, next) {
    try {
      const { id } = req.params;

      const form = await Form.findById(id);
      if (!form) {
        return next({ status: 404, message: 'Form submission not found' });
      }

      if (form.employment.resume) {
        try {
          await fs.unlink(form.employment.resume);
        } catch (err) {
          console.warn(`Failed to delete resume: ${form.employment.resume}`, err);
        }
      }

      await Form.deleteOne({ _id: id });

      return res.status(200).json({ message: 'Form submission deleted successfully', success: true });
    } catch (error) {
      return next(error);
    }
  },

  async getAll(req, res, next) {
    try {
      const forms = await Form.find({}, { 'personal.password': 0 });
      return res.status(200).json({ forms, success: true });
    } catch (error) {
      return next(error);
    }
  },
  async getById(req, res, next) {
    const id = req.params.id
    try {
      const form = await Form.findById(id, { 'personal.password': 0 });
      return res.status(200).json({ form, success: true });
    } catch (error) {
      return next(error);
    }
  },
};


module.exports = formsController;
