import { Request, Response } from "express";
import FormRequests from "../models/formRequests.model.js";
import logger from "../middleware/logger/index.js";

export const createFormRequest = async (req: Request, res: Response) => {
  if (!req.body.customerData.customerId) {
    return res.status(400).json({
      message: "Content can not be empty!",
    });
  }
  try {
    const formRequest = {
      firstName: req.body.customerData.info_FirstName,
      lastName: req.body.customerData.info_LastName,
      email: req.body.customerData.info_Email,
      dob: req.body.customerData.info_DOB,
      phone: req.body.customerData.info_Phone,
      zipCode: req.body.customerData.info_ZipCode,
      experienceLevel: req.body.customerData.usage_experienceLevel,
      frequency: req.body.customerData.usage_frequency,
      treatmentCategory: req.body.customerData.treatment_Purpose,
      budget: req.body.customerData.budgets,
      consumptionMethods: req.body.customerData.consumption_Methods,
      headspace: req.body.customerData.headspace,
      diet: req.body.customerData.diet,
      activityLevel: req.body.customerData.activity_Level,
      medicationUse: req.body.customerData.medical_conditions.join(", "),
      alcoholUse: req.body.customerData.competing_AlcoholUse,
      cigaretteUse: req.body.customerData.competing_CigaretteUse,
      storeId: req.body.storeId,
      customerId: parseInt(req.body.customerData.customerId),
      createdBy: parseInt(req.body.customerData.customerId),
      updatedBy: parseInt(req.body.customerData.customerId),
    };
    const newFormRequest = await FormRequests.create(formRequest);
    return res.status(200).json(newFormRequest);
  } catch (error: any) {
    logger.error(`message: ${error.message}`);
    return res.status(500).json({ message: error.message });
  }
};

export const findAllFormRequests = async (req: Request, res: Response) => {
  try {
    const customerId = req.query.customerId;
    const allCustomerFormRequests = await FormRequests.findAll({
      where: { customerId: { customerId: customerId } },
    });
    return res.status(200).json(allCustomerFormRequests);
  } catch (error: any) {
    logger.error(`message: ${error.message}`);
    return res.status(500).json({ message: error.message });
  }
};

export const findOneFormRequest = async (req: Request, res: Response) => {
  try {
    const id = +req.params.id;
    const formRequest = await FormRequests.findByPk(id);
    return res.status(200).json(formRequest);
  } catch (error: any) {
    logger.error(`message: ${error.message}`);
    return res.status(500).json({ message: error.message });
  }
};

export const updateFormRequest = async (req: Request, res: Response) => {
  try {
    const id = +req.params.id;
    const rowsUpdated = await FormRequests.update(req.body, {
      where: { id: id },
    });
    if (rowsUpdated) {
      const updatedFormRequest = await FormRequests.findByPk(id);
      return res.status(200).json(updatedFormRequest);
    } else {
      return res.status(400).json({
        message: `Cannot delete retail form request with id=${id}. Maybe retail form request was not found!`,
      });
    }
  } catch (error: any) {
    logger.error(`message: ${error.message}`);
    return res.status(500).json({ message: error.message });
  }
};

export const deleteFormRequest = async (req: Request, res: Response) => {
  try {
    const id = +req.params.id;
    await FormRequests.destroy({
      where: { id: id },
    });
    return res.status(200).json(`Retail Form Request ${id} Deleted`);
  } catch (error: any) {
    logger.error(`message: ${error.message}`);
    return res.status(500).json({ message: error.message });
  }
};

export const deleteAllFormRequests = async (req: Request, res: Response) => {
  try {
    const deletedFormRequests = await FormRequests.destroy({
      where: {},
      truncate: false,
    });
    return res
      .status(200)
      .json(`Deleted ${deletedFormRequests} Retail Form Requests`);
  } catch (error: any) {
    logger.error(`message: ${error.message}`);
    return res.status(500).json({ message: error.message });
  }
};
