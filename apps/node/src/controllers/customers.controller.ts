import { Request, Response, RequestHandler } from "express";
import Customers from "../models/customers.model.js";
import CustomerStoreCategoryRelation from "../models/storeCategoryRelation.model.js";
import {
  compareHashedPassword,
  generateUniqueName,
  hashPassword,
} from "../utils/common-functions.js";
import { generateB2CAuthToken } from "../middleware/authMiddleware.js";
import { SendgridEmailService } from "../utils/sendGridEmailService.js";
import { authenticateEmailToken } from "../middleware/authMiddleware.js";
import logger from "../middleware/logger/index.js";
import redisService from "../utils/redisService.js";
import _ from "lodash";

export const createCustomer: RequestHandler = async (
  req: Request,
  res: Response,
) => {
  const {
    storeId,
    firstName,
    lastName,
    birthDate,
    driversLicense,
    phone,
    email,
    password,
  } = req.body;

  if (!storeId)
    return res.status(400).json({ message: "StoreId cannot be empty!" });
  if (!driversLicense)
    return res
      .status(400)
      .send({ message: "Drivers License number cannot be empty!" });
  if (!firstName && !req.body.isAnonymous)
    return res.status(400).json({ message: "First name cannot be empty!" });
  if (!lastName && !req.body.isAnonymous)
    return res.status(400).json({ message: "Last name cannot be empty!" });
  if (!birthDate)
    return res.status(400).json({ message: "Date of birth cannot be empty!" });
  // if (!email)
  //   return res.status(400).json({ message: "Email cannot be empty!" });
  if (!password)
    return res.status(400).json({ message: "Password cannot be empty!" });
  if (!phone)
    return res.status(400).json({ message: "Phone cannot be empty!" });

  try {
    const condition = { driversLicense: driversLicense };
    const alreadyPresent = await Customers.findOne({
      where: condition,
      attributes: { exclude: ["password"] },
    });

    if (alreadyPresent) {
      return res.status(400).json({ message: "driversLicense already exist" });
    } else {
      let _email = email;
      let _firstName = firstName;
      let _phone = phone;
      if (req.body.isAnonymous) {
        _email = await generateUniqueName();
        _firstName = _email;
        _phone = _email;
      }
      const hashedPassword = await hashPassword(password);
      const newCustomer = await Customers.create({
        ...req.body,
        email: _email,
        phone: _phone,
        dob: birthDate,
        name: firstName,
        firstName: _firstName,
        password: hashedPassword,
      });
      const token = generateB2CAuthToken(newCustomer);
      return res.status(200).json({ customer: newCustomer, token: token });
    }
  } catch (error: any) {
    logger.error(`message: ${error.message}`);
    return res.status(500).json({ message: error.message });
  }
};

export const findAllCustomers: RequestHandler = async (
  req: Request,
  res: Response,
) => {
  try {
    const allRetailCustomers = await Customers.findAll();
    return res.status(200).json(allRetailCustomers);
  } catch (error: any) {
    logger.error(`message: ${error.message}`);
    return res.status(500).json({ message: error.message });
  }
};

export const findOneCustomer: RequestHandler = async (
  req: Request,
  res: Response,
) => {
  try {
    const customerId = +req.params.id;
    const customer = await Customers.findByPk(customerId);
    res.status(200).json(customer);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// serdar: this is used internally
export const findCustomerByEmail = async (emailAddress: string) => {
  return await Customers.findOne({
    where: { email: emailAddress },
  });
};

export const updateCustomer = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res
        .status(401)
        .json({ message: "Access denied. No token provided." });
    }
    const customerId = +req.params.id;

    if (!customerId)
      return res.status(400).json({ message: "Customer id is missing!" });
    const customer = await Customers.findByPk(customerId, { raw: true });
    if (!customer)
      return res.status(404).json({ message: "Customer was not found!" });

    customer.firstName = req.body.firstName;
    customer.lastName = req.body.lastName;
    customer.city = "";
    customer.status = "";
    customer.middleName = "";
    customer.dob = req.body.birthDate;
    customer.driversLicense = req.body.driversLicense;
    customer.driversLicenseExpiration = req.body.driversLicenseExpiration;
    customer.gender = req.body.gender;
    customer.address = req.body.address;
    customer.isNewCustomer = false;
    customer.name = req.body.firstName + " " + req.body.lastName;
    customer.phone = req.body.phone;
    customer.email = req.body.email;
    customer.postalCode = req.body.postalCode;
    customer.medicalIdNumber = req.body.medicalIdNumber;
    customer.experienceLevel = req.body.experienceLevel;
    customer.frequency = req.body.frequency;
    customer.pastEffectiveness = req.body.pastEffectiveness;
    customer.headspace = req.body.headspace;
    customer.budget = req.body.budget;
    customer.diet = req.body.diet;
    customer.activityLevel = req.body.activityLevel;
    customer.medicationUse = req.body.medicationUse;
    customer.alcoholUse = req.body.alcoholUse;
    // customer.alcoholUseStatus = req.body.alcoholUseStatus;
    customer.cigaretteUse = req.body.cigaretteUse;
    customer.treatmentCategory = req.body.treatmentCategory;
    customer.treatmentSubcategory = req.body.treatmentSubcategory;
    customer.consumptionMethods = req.body.consumptionMethods;
    customer.preferNotToSay = req.body.preferNotToSay;

    try {
      // customer = await customer.save();
      await Customers.update(customer, {
        where: { id: customerId },
      });
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }

    updateCustomerInCache(customer);

    return res.status(200).json(customer);
  } catch (error: any) {
    logger.error(`message: ${error.message}`);
    return res.status(500).json({ message: error.message });
  }
};

// TODO: REMOVE CACHE - no cache customers
const updateCustomerInCache = async (customer: Customers) => {
  try {
    const redisClient = await redisService.getClient();
    await redisClient.hSet(
      process.env.REDIS_KEY_CUSTOMERS,
      customer.id,
      JSON.stringify(customer),
    );
  } catch (error) {
    logger.error("Error updating RetailCustomers data in Redis:", error);
  }
};

export const deleteCustomer: RequestHandler = async (
  req: Request,
  res: Response,
) => {
  try {
    const customerId = +req.params.id;
    await Customers.destroy({
      where: { customerId: customerId },
    });
    return res.status(200).json(`Retail Customer ${customerId} Deleted`);
  } catch (error: any) {
    logger.error(`message: ${error.message}`);
    return res.status(500).json({ message: error.message });
  }
};

export const deleteAllCustomers: RequestHandler = async (
  req: Request,
  res: Response,
) => {
  try {
    const deletedRetailCustomers = await Customers.destroy({
      where: {},
      truncate: false,
    });
    return res
      .status(201)
      .json(`Deleted ${deletedRetailCustomers} Retail Customers`);
  } catch (error: any) {
    logger.error(`message: ${error.message}`);
    return res.status(500).json({ message: error.message });
  }
};

export const SearchForCustomer: RequestHandler = async (
  req: Request,
  res: Response,
) => {
  try {
    const condition = {
      driversLicense: req.body.driversLicense,
    };

    const redisClient = await redisService.getClient();
    //serdar:todo: we don't hash the customers using driver's license id so we cannot find them in the cache using this value. + driver's license can be removed in the future.
    //serdar: we cannot send id from the client side and we are caching the users using their IDs because MOST of the operations are done using customer IDs.
    //serdar: we cannot use the email address to search for the customer in the cache. I am disabling the lines below for now.

    // const cacheKey = "RetailCustomers";
    // const cachedCustomersString = await redisClient.get(cacheKey);

    // if (cachedCustomersString) {
    //   const cachedCustomers = JSON.parse(cachedCustomersString);
    //   const customer = cachedCustomers.find(
    //     (c) => c.retailcustomer_driverslicense === req.body.driversLicense,
    //   );

    //   if (customer) {
    //     const token = generateB2CAuthToken(customer);
    //     return res.status(200).json({ customer, exists: true, token });
    //   }
    // }

    let customer = await Customers.findOne({ where: condition });

    if (customer) {
      customer.isNewCustomer = false;

      if (
        req.body.driversLicenseExpiration &&
        req.body.driversLicenseExpiration !== customer.driversLicense
      )
        customer.driversLicenseExpiration = req.body.driversLicenseExpiration;
      if (req.body.gender && req.body.gender !== customer.gender)
        customer.gender = req.body.gender;
      if (req.body.address && req.body.address !== customer.address)
        customer.address = req.body.address;

      customer = await customer.save();

      // TODO: Relation Table

      const token = generateB2CAuthToken(customer);

      await redisClient.hSet(
        process.env.REDIS_KEY_CUSTOMERS,
        customer.id,
        JSON.stringify(customer),
      );

      return res.status(200).json({ customer, exists: true, token });
    }

    return res.status(200).json({ customer: null, exists: false });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const LoginCustomerByMobilePassword = async (
  req: Request,
  res: Response,
) => {
  try {
    const { storeId, mobile, password } = req.body;

    if (!storeId)
      return res.status(400).json({ message: "StoreId cannot be empty!" });
    if (!mobile)
      return res.status(400).json({ message: "mobile cannot be empty!" });
    if (!password)
      return res.status(400).json({ message: "Password cannot be empty!" });

    const condition = { phone: mobile };
    const customer = await Customers.findOne({
      where: condition,
      raw: true,
    });

    if (!customer)
      return res.status(400).json({ message: "Invalid Mobile or password." });

    const validPassword = await compareHashedPassword(
      password,
      customer.password,
    );

    if (!validPassword)
      return res.status(400).json({ message: "Invalid password." });

    const token = generateB2CAuthToken(customer);

    return res.status(200).json({ customer, token });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const ResetPasswordOfCustomer: RequestHandler = async (
  req: Request,
  res: Response,
) => {
  try {
    const { password, token } = req.body;

    if (!token) {
      return res.status(400).json({ message: "No Token has been provided" });
    }

    const verifiedTokenResponse = await authenticateEmailToken(token);
    if (!verifiedTokenResponse.customerId) {
      return res
        .status(400)
        .json({ message: "Customer not present in database." });
    }
    const { customerId } = verifiedTokenResponse;

    const hashedPassword = await hashPassword(password);
    await Customers.update(
      { password: hashedPassword },
      {
        where: { customerId: customerId },
      },
    );

    return res.status(200).json({ message: "Password reset successfully!" });
  } catch (error: any) {
    logger.error(`message: ${error.message}`);
    return res.status(500).json({ message: error.message });
  }
};

export const SendCustomerRestPasswordResetEmail: RequestHandler = async (
  req: Request,
  res: Response,
) => {
  try {
    const { email } = req.body;

    const customer = await Customers.findOne({
      where: { email: email },
    });
    if (!customer) {
      return res
        .status(400)
        .json({ message: "Email not present in database." });
    }
    const jwtToken = generateB2CAuthToken(customer);
    const emailService = new SendgridEmailService();
    const resetLink = `${process.env.RESET_PASSWORD_LINK}${jwtToken}`;
    const emailSent = await emailService.sendPasswordResetEmail(email, {
      link: resetLink,
    });

    if (emailSent) {
      return res
        .status(200)
        .json({ message: "Password reset email sent successfully" });
    } else {
      return res
        .status(500)
        .json({ error: "Failed to send password reset email" });
    }
  } catch (error: any) {
    logger.error(`message: ${error.message}`);
    return res.status(500).json({ message: error.message });
  }
};

// serdar: used to import anonymous users with store category relation data
export const findRetailCustomerStoreCategoryRelation = async (
  req: Request,
  res: Response,
) => {
  try {
    const retailcustomer_email = req.params.anonymousId;
    const storeId = req.params.storeId;

    const customer = await Customers.findOne({
      where: { retailcustomer_email, is_anonymous: true },
    });
    if (!customer) {
      return res.status(500).json({ message: "Customer not found" });
    }
    const customerStoreCategoryRelationData: any =
      await CustomerStoreCategoryRelation.findOne({
        where: { customer_id: customer.id, store_id: storeId },
      });

    if (customerStoreCategoryRelationData) {
      customer.pastEffectiveness =
        customerStoreCategoryRelationData.pasteffectiveness_id;
      customer.headspace = customerStoreCategoryRelationData.headspace_id;
      customer.consumptionMethods =
        customerStoreCategoryRelationData.categories;
    } else {
      customer.pastEffectiveness = "0";
      customer.headspace = "0";
      customer.consumptionMethods = "";
    }
    const token = generateB2CAuthToken(customer);
    return res.status(200).json({ customer: customer, token: token });
  } catch (error: any) {
    return res.status(500).json({ message: error?.message });
  }
};

export const CheckIfCustomerExists: RequestHandler = async (
  req: Request,
  res: Response,
) => {
  try {
    const condition = {
      customerId: req.body.id,
    };

    const customer = await Customers.findOne({ where: condition });
    if (customer) {
      return res.status(200).json({ exists: true, customer: customer });
    }

    return res.status(404).json({ exists: false, customer: null });
  } catch (error: any) {
    logger.error(`message: ${error.message}`);
    return res.status(500).json({ message: error.message });
  }
};

// serdar: used to import anonymous users with store category relation data
export const findStoreCategoryRelation: RequestHandler = async (
  req: Request,
  res: Response,
) => {
  try {
    const retailcustomer_email = req.params.anonymousId;
    const storeId = req.params.storeId;

    const customer: any = await Customers.findOne({
      where: { email: retailcustomer_email, isAnonymous: true },
      raw: true,
    });
    if (!customer) {
      return res.status(500).json({ message: "Customer not found" });
    }
    const customerStoreCategoryRelationData: any =
      await CustomerStoreCategoryRelation.findOne({
        where: { id: customer.id, store_id: storeId },
      });

    if (customerStoreCategoryRelationData) {
      customer.pastEffectiveness = parseInt(
        customerStoreCategoryRelationData.pasteffectiveness_id,
      );
      customer.headspace = parseInt(
        customerStoreCategoryRelationData.headspace_id,
      );
      customer.consumptionMethods =
        customerStoreCategoryRelationData.categories;
    } else {
      customer.pastEffectiveness = 0;
      customer.headspace = 0;
      customer.consumptionMethods = "";
    }
    const token = generateB2CAuthToken(customer);
    return res.status(200).json({ customer: customer, token: token });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

// serdar: this is called from the client side
export const findAnonymousCustomerByEmailApi = async (
  req: Request,
  res: Response,
) => {
  try {
    const retailcustomer_email = req.params.email;
    const customer: any = await Customers.findOne({
      where: { retailcustomer_email, is_anonymous: true },
    });
    if (!customer) {
      return res.status(500).json({ message: "Customer not found" });
    }
    const token = generateB2CAuthToken(customer);
    return res.status(200).json({ customer: customer, token: token });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const createOrUpdateCustomerStoreCategoryRelation = async (
  storeId: number,
  customerId: number,
  categories: string,
  headspace: string,
  pastEffectiveness: string,
) => {
  let relation: any = await CustomerStoreCategoryRelation.findOne({
    where: { customer_id: customerId, store_id: storeId },
  });

  if (!relation) {
    relation = {
      store_id: storeId,
      customer_id: customerId,
      categories,
      headspace_id: headspace,
      pasteffectiveness_id: pastEffectiveness,
      createdBy: 1,
      updatedBy: 1,
    };
    await CustomerStoreCategoryRelation.create(relation);
  } else if (
    relation.categories !== categories ||
    relation.headspace_id !== headspace ||
    relation.pasteffectiveness_id !== pastEffectiveness
  ) {
    relation.categories = categories;
    relation.headspace_id = headspace;
    relation.pasteffectiveness_id = pastEffectiveness;
    relation.updatedBy = 1;

    await relation.save();
  }
};
