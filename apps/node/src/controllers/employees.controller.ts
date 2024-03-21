import { Request, Response } from "express";
import Employees from "../models/employees.model.js";
import Chains from "../models/chains.model.js";
import propelAuth from "../utils/propelAuth.js";
import { SendgridEmailService } from "../utils/sendGridEmailService.js";
import floraSequelize from "../sequelize.js";
import logger from "../middleware/logger/index.js";

export const createStoreEmployee = async (req: Request, res: Response) => {
  if (!req.body.name || !req.body.email) {
    return res.status(400).json({
      message: "Content can not be empty!",
    });
  }

  const doesUserExist = await Employees.findOne({
    where: { email: req.body.email },
  });

  const { users } = await propelAuth.fetchUsersByQuery({
    pageSize: 1,
    emailOrUsername: req.body.email,
  });

  if (doesUserExist || users.length) {
    return res.status(400).json({
      message: "Someone with that email already exists!",
    });
  }

  const nameArr = req.body.name.split(" ");

  const t = await (await floraSequelize).transaction();
  try {
    const chain = await Chains.findOne({
      where: { name: req.body.chainName },
      transaction: t,
    });
    if (!chain?.id) {
      return res.status(400).json({ message: "No chain found" });
    }
    let employee = {
      ...req.body,
      chainId: chain.id,
      role: req.body.role,
    };

    const propelUser = await propelAuth.createUser({
      email: employee.email,
      username: employee.email.split("@")[0],
      firstName: nameArr[0],
      lastName: nameArr[1],
      sendEmailToConfirmEmailAddress: true,
      askUserToUpdatePasswordOnLogin: true,
    });

    await propelAuth.addUserToOrg({
      userId: propelUser.userId,
      orgId: employee.externalOrgId,
      role: employee.role,
    });

    employee = {
      ...employee,
      firstName: nameArr[0],
      lastName: nameArr[1],
      externalId: propelUser.userId,
    };

    const newStoreEmployee = await Employees.create(employee, {
      transaction: t,
    });

    await t.commit();

    logger.info(
      `Employee created successfully with ID: ${newStoreEmployee.id}`,
    );
    return res.status(200).json(newStoreEmployee);
  } catch (error: any) {
    t.rollback();

    const { users } = await propelAuth.fetchUsersByQuery({
      pageSize: 1,
      emailOrUsername: req.body.retailstoreemployee_email,
    });

    if (users?.length > 0) {
      await propelAuth.deleteUser(users[0].userId);
    }

    logger.error(`Failed to create employee in storeId: ${req.body.storeId}`);
    return res.status(500).json({ message: error.message });
  }
};

export const findAllEmployees = async (req: Request, res: Response) => {
  try {
    const allEmployees = await Employees.findAll();
    return res.status(200).json(allEmployees);
  } catch (error: any) {
    logger.error(`message: ${error.message}`);
    return res.status(500).json({ message: error.message });
  }
};

export const findAllStoreEmployees = async (req: Request, res: Response) => {
  try {
    const storeId = req.params.storeId;
    const allStoreEmployees = await Employees.findAll({
      where: { storeId: storeId },
    });
    return res.status(200).json(allStoreEmployees);
  } catch (error: any) {
    logger.error(`message: ${error.message}`);
    return res.status(500).json({ message: error.message });
  }
};

export const findOneStoreEmployee = async (req: Request, res: Response) => {
  try {
    const employeeId = +req.params.employeeId;
    const storeId = +req.params.storeId;
    const employee = await Employees.findOne({
      where: {
        storeId: storeId,
        employeeId: employeeId,
      },
    });
    return res.status(200).json(employee);
  } catch (error: any) {
    logger.error(`message: ${error.message}`);
    return res.status(500).json({ message: error.message });
  }
};

export const updateStoreEmployee = async (req: Request, res: Response) => {
  try {
    const employeeId = req.params.id;

    const oldStoreEmployee = await Employees.findByPk(employeeId);

    const t = await (await floraSequelize).transaction();

    const rowsUpdated = await Employees.update(req.body, {
      where: { id: employeeId },
      transaction: t,
    });

    if (rowsUpdated) {
      const updatedStoreEmployee = await Employees.findByPk(employeeId, {
        transaction: t,
      });

      if (
        updatedStoreEmployee &&
        oldStoreEmployee &&
        updatedStoreEmployee.email !== oldStoreEmployee.email
      ) {
        await propelAuth.updateUserEmail(
          updatedStoreEmployee.externalId as string,
          {
            newEmail: updatedStoreEmployee.email as string,
            requireEmailConfirmation: true,
          },
        );
      }

      if (
        (updatedStoreEmployee &&
          oldStoreEmployee &&
          updatedStoreEmployee.name !== oldStoreEmployee.name) ||
        (updatedStoreEmployee &&
          oldStoreEmployee &&
          updatedStoreEmployee.role !== oldStoreEmployee.role)
      ) {
        await propelAuth.updateUserMetadata(
          updatedStoreEmployee.externalId as string,
          {
            firstName: updatedStoreEmployee.firstName,
            lastName: updatedStoreEmployee.lastName,
          },
        );
      }

      if (
        updatedStoreEmployee &&
        oldStoreEmployee &&
        updatedStoreEmployee.role !== oldStoreEmployee.role
      ) {
        await propelAuth.changeUserRoleInOrg({
          userId: updatedStoreEmployee.externalId,
          orgId: updatedStoreEmployee.externalOrgId,
          role: updatedStoreEmployee.role,
        });
      }
      t.commit();
      return res.status(200).json(updatedStoreEmployee);
    } else {
      return res.status(400).json({
        message: `Cannot update retail store employee with id=${employeeId}. Maybe retail store employee was not found or req.body is empty!`,
      });
    }
  } catch (error: any) {
    logger.error(`message: ${error.message}`);
    return res.status(500).json({ message: error.message });
  }
};

export const deleteStoreEmployee = async (req: Request, res: Response) => {
  try {
    const employeeId = +req.params.id;

    const employee = await Employees.findOne({
      where: {
        id: employeeId,
      },
    });

    await propelAuth.deleteUser(employee?.externalId as string);

    await Employees.destroy({
      where: { id: employeeId },
    });

    return res.status(200).json(`Retail Store Employee ${employeeId} Deleted`);
  } catch (error: any) {
    logger.error(`message: ${error.message}`);
    return res.status(500).json({ message: error.message });
  }
};

export const deleteAllStoreEmployees = async (req: Request, res: Response) => {
  try {
    const deletedStoreEmployees = await Employees.destroy({
      where: {},
      truncate: false,
    });
    return res
      .status(200)
      .json(`Deleted ${deletedStoreEmployees} Retail Store Employees`);
  } catch (error: any) {
    logger.error(`message: ${error.message}`);
    return res.status(500).json({ message: error.message });
  }
};

export const updateRetailStoreEmployeeLoginCount = async (
  req: Request,
  res: Response,
) => {
  try {
    const { employeeExtId } = req.params;
    const employee = await Employees.findOne({
      where: { externalId: employeeExtId },
    });
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    employee.increment("loginCount");
    await employee.save();
    return res
      .status(200)
      .json({ message: "Employee Login Count Updated by 1" });
  } catch (error: any) {
    logger.error(`message: ${error.message}`);
    return res.status(500).json({ message: error.message });
  }
};

export const updateRetailStoreEmployeeStatus = async (
  req: Request,
  res: Response,
) => {
  try {
    const { employeeExtId } = req.params;
    const { status } = req.body;

    if (!["ACTIVE", "INACTIVE"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }
    const employee = await Employees.findOne({
      where: { externalId: employeeExtId },
    });

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    employee.activeStatus = status;
    await employee.save();

    return res.json({ status: status });
  } catch (error: any) {
    logger.error("Error updating status:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getRetailStoreEmployeeStatus = async (
  req: Request,
  res: Response,
) => {
  try {
    const { employeeExtId } = req.params;
    const employee = await Employees.findOne({
      where: { externalId: employeeExtId },
    });
    if (!employee) {
      return res.status(404).json({ message: "No Employee Found" });
    }
    return res.status(200).json({ status: employee.activeStatus });
  } catch (error: any) {
    logger.error(`message: ${error.message}`);
    return res.status(500).json({ message: error.message });
  }
};

export const sendHelpRequestEmail = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, issueDescription, content } = req.body;

    const emailService = new SendgridEmailService();
    const emailSent = await emailService.sendBudTenderPortalHelpRequestEmail({
      firstName: firstName,
      lastName: lastName,
      issueDescription: issueDescription,
      content: content,
    });

    if (emailSent) {
      return res
        .status(200)
        .json({ message: "Help Request From Submitted Successfully" });
    } else {
      return res
        .status(500)
        .json({ error: "Failed to send help request form email" });
    }
  } catch (error: any) {
    logger.error(`message: ${error.message}`);
    return res.status(500).json({ message: error.message });
  }
};

export const findAllOrgEmployees = async (req: Request, res: Response) => {
  try {
    const extOrgId = req.params.extOrgId;
    const allStoreEmployees = await Employees.findAll({
      where: { externalOrgId: extOrgId },
    });
    return res.status(200).json(allStoreEmployees);
  } catch (error: any) {
    logger.error(`message: ${error.message}`);
    return res.status(500).json({ message: error.message });
  }
};

export const getUserInformationByExtId = async (
  req: Request,
  res: Response,
) => {
  const { employeeExtId } = req.query;

  if (!employeeExtId)
    return res.status(400).json({ message: "Employee Ext Id is missing." });

  const employee = await Employees.findOne({
    where: { externalId: employeeExtId },
  });

  if (employee !== null) {
    return res.status(200).json(employee);
  } else {
    return res.status(404).json({ message: "User was not found." });
  }
};
