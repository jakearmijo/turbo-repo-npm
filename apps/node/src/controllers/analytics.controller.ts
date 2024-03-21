import { Request, Response } from "express";
import { Op } from "sequelize";
import Customers from "../models/customers.model.js";
import FormRequests from "../models/formRequests.model.js";
import Stores from "../models/stores.model.js";
import logger from "../middleware/logger/index.js";
import Recommendations from "../models/recommendations.model.js";

const getPercentChange = (curr: any, prev: any) => {
  let percentChange = undefined;
  if (isNaN(prev) || isNaN(curr)) {
    percentChange = undefined;
  } else if (prev === 0 && curr === 0) {
    percentChange = "No Change"; // Handle both counts being 0
  } else if (prev === 0) {
    percentChange = "Infinity"; // Handle only yesterday's count being 0
  } else {
    percentChange = ((curr - prev) / prev) * 100;
    percentChange = percentChange.toFixed(1) + "%";
  }

  return percentChange;
};

const getTopFiveRecs = (recs: any) => {
  const productArray = [];
  const productMap = new Map();
  // rec  = [ [{}], [{}], [{}]  ]

  for (let i = 0; i < recs.length; i++) {
    const customerProductRec = JSON.parse(recs[i].products);
    productArray.push(...customerProductRec);
  }

  for (let i = 0; i < productArray.length; i++) {
    const id = productArray[i].id;
    const name = productArray[i].name;

    if (!productMap.has(id)) {
      productMap.set(id, { name, count: 1 });
      continue;
    }
    const count = productMap.get(id).count;
    productMap.set(id, { name, count: count + 1 });
  }

  const resultRec = [...productMap.entries()].sort(
    (a, b) => a[1].count - b[1].count,
  );

  const topFive = resultRec.reverse().splice(0, 5);

  return topFive;
};

const getCustomerFormRequestAnalytics = (data: any) => {
  // [key: string]: { id: string; value: number; label: string };
  const consumptionMethodCount: {
    [key: string]: { id: string; value: number; label: string };
  } = {};
  const headspaceCount: {
    [key: string]: { headspace: string; value: number };
  } = {};
  const budgetSelections: {
    [key: string]: { value: number; budget: string };
  } = {};
  const treatmentCount: {
    [key: string]: { id: string; value: number; label: string };
  } = {};
  const formRec = data;

  for (let i = 0; i < formRec.length; i++) {
    const methods = formRec[i].consumptionMethods || "";
    const headspace = formRec[i].headspace || "";
    const budget = formRec[i].budget.replace(/^\D+/g, "");
    const medicalConditions = formRec[i].medicationUse || "";
    const splitMethods = methods.split(",") || [];
    let splitConditions = medicalConditions?.split(",") || [];

    // treatment concerns
    if (splitConditions[0] === "") {
      splitConditions = ["Recreational"];
    }
    splitConditions?.forEach((c: string) => {
      if (treatmentCount[c]) {
        treatmentCount[c] = {
          ...treatmentCount[c],
          value: treatmentCount[c].value + 1,
        };
      } else {
        treatmentCount[c] = {
          id: c,
          label: c,
          value: 1,
        };
      }
    });

    //budget
    if (budget === "") {
      if (budgetSelections["any"]) {
        budgetSelections["any"] = {
          ...budgetSelections["any"],
          value: budgetSelections["any"].value + 1,
        };
      } else {
        budgetSelections["any"] = {
          budget: "any",
          value: 1,
        };
      }
      continue;
    } else if (budgetSelections[budget]) {
      budgetSelections[budget] = {
        ...budgetSelections[budget],
        value: budgetSelections[budget].value + 1,
      };
    } else {
      budgetSelections[budget] = {
        budget,
        value: 1,
      };
    }

    // consumption methods
    splitMethods.forEach((m: string) => {
      if (consumptionMethodCount[m]) {
        consumptionMethodCount[m] = {
          ...consumptionMethodCount[m],
          value: consumptionMethodCount[m].value + 1,
        };
      } else {
        consumptionMethodCount[m] = {
          id: m,
          label: m,
          value: 1,
        };
      }
    });

    //headspace
    if (headspaceCount[headspace]) {
      headspaceCount[headspace] = {
        ...headspaceCount[headspace],
        value: headspaceCount[headspace].value + 1,
      };
    } else {
      headspaceCount[headspace] = {
        headspace,
        value: 1,
      };
    }
  }

  return {
    consumptionMethodCount,
    headspaceCount,
    budgetSelections,
    treatmentCount,
  };
};

export const getBasicAnalytics = async (req: Request, res: Response) => {
  try {
    let data = {};

    //get all customer stores
    const chainId = req.params.chainId;
    const stores = await Stores.findAll({
      where: { chainId: parseInt(chainId) },
      raw: true,
    });
    const storeIds = stores.map((s) => s.id);

    const customerRecs = [];
    const customerFormRecs = [];

    for (let i = 0; i < storeIds.length; i++) {
      // for most reccomended products
      const recs = await Recommendations.findAll({
        where: { storeId: `${storeIds[i]}` },
        attributes: ["products"],
      });

      if (recs.length) customerRecs.push(...recs);

      const forms = await FormRequests.findAll({
        where: { storeId: `${storeIds[i]}` },
      });
      if (forms.length) customerFormRecs.push(...forms);
    }

    const {
      consumptionMethodCount,
      headspaceCount,
      budgetSelections,
      treatmentCount,
    } = getCustomerFormRequestAnalytics([...customerFormRecs]);

    const topFiveRecs = getTopFiveRecs(customerRecs);

    data = {
      topFiveRecs: topFiveRecs || [],
      consumptionMethodCount: Object.values(consumptionMethodCount) || [],
      headspaceCount: Object.values(headspaceCount) || [],
      budgetSelections: Object.values(budgetSelections) || [],
      treatmentCount: Object.values(treatmentCount) || [],
    };

    return res.status(200).json({ ...data });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ message: error });
  }
};

export const getAggregatedCustomers = async (req: Request, res: Response) => {
  // Get dates - make these constants
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const startOfDay = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );
  const endOfDay = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() + 1,
  );
  const startOfYesterday = new Date(
    yesterday.getFullYear(),
    yesterday.getMonth(),
    yesterday.getDate(),
  );
  const endOfYesterday = new Date(
    yesterday.getFullYear(),
    yesterday.getMonth(),
    yesterday.getDate() + 1,
  );

  const startOfWeek = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() - today.getDay(),
  ); // Sunday
  const endOfWeek = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() + (6 - today.getDay()),
  ); // Saturday

  // Get the start and end of last week
  const lastWeekStart = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() - today.getDay() - 7,
  ); // Sunday of last week
  const lastWeekEnd = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() - today.getDay() - 1,
  ); // Saturday of last week

  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1); // First day of the month
  const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0); // Last day of the month

  // Get the start and end of last month
  const lastMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1); // First day of last month
  const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);

  try {
    const chainId = req.params.chainId;
    const stores = await Stores.findAll({
      where: { chainId: parseInt(chainId) },
      // raw: true,
    });
    const storeIds = stores.map((s) => s.id);

    const customersMap = new Map();

    // get cout values for day,week,month
    for (let i = 0; i < storeIds.length; i++) {
      const cusToday = await Customers.count({
        where: {
          storeId: `${storeIds[i]}`,
          updatedAt: {
            [Op.gte]: startOfDay,
            [Op.lte]: endOfDay,
          },
        },
      });
      customersMap.set("today", (customersMap.get("today") || 0) + cusToday);

      const cusYesterday = await Customers.count({
        where: {
          storeId: `${storeIds[i]}`,
          updatedAt: {
            [Op.gte]: startOfYesterday,
            [Op.lte]: endOfYesterday,
          },
        },
      });
      customersMap.set(
        "yesterday",
        (customersMap.get("yesterday") || 0) + cusYesterday,
      );

      const cusThisWeek = await Customers.count({
        where: {
          storeId: `${storeIds[i]}`,
          updatedAt: {
            [Op.gte]: startOfWeek,
            [Op.lte]: endOfWeek,
          },
        },
      });
      customersMap.set(
        "thisWeek",
        (customersMap.get("thisWeek") || 0) + cusThisWeek,
      );
      const cusLastWeek = await Customers.count({
        where: {
          storeId: `${storeIds[i]}`,
          updatedAt: {
            [Op.gte]: lastWeekStart,
            [Op.lte]: lastWeekEnd,
          },
        },
      });
      customersMap.set(
        "lastWeek",
        (customersMap.get("lastWeek") || 0) + cusLastWeek,
      );
      // this Month
      const cusThisMonth = await Customers.count({
        where: {
          storeId: `${storeIds[i]}`,
          updatedAt: {
            [Op.gte]: startOfMonth,
            [Op.lte]: endOfMonth,
          },
        },
      });
      customersMap.set(
        "thisMonth",
        (customersMap.get("thisMonth") || 0) + cusThisMonth,
      );
      // last month
      const cusLastMonth = await Customers.count({
        where: {
          storeId: `${storeIds[i]}`,
          updatedAt: {
            [Op.gte]: lastMonthStart,
            [Op.lte]: lastMonthEnd,
          },
        },
      });
      customersMap.set(
        "lastMonth",
        (customersMap.get("lastMonth") || 0) + cusLastMonth,
      );
    }

    const countToday = customersMap.get("today");
    const countYesterday = customersMap.get("yesterday");
    const countThisWeek = customersMap.get("thisWeek");
    const countLastWeek = customersMap.get("lastWeek");
    const countThisMonth = customersMap.get("thisMonth");
    const countLastMonth = customersMap.get("lastMonth");

    customersMap.set("yesterday", getPercentChange(countToday, countYesterday));
    customersMap.set(
      "lastWeek",
      getPercentChange(countThisWeek, countLastWeek),
    );
    customersMap.set(
      "lastMonth",
      getPercentChange(countThisMonth, countLastMonth),
    );

    return res.status(200).json([...customersMap.entries()]);
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ message: error });
  }
};
