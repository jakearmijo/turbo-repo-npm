import { randomBytes, scrypt } from 'crypto';
import { promisify } from 'util';

const scryptAsync = promisify(scrypt);

import jwt from "jsonwebtoken";
import {
  uniqueNamesGenerator,
  adjectives,
  colors,
  animals,
  NumberDictionary,
} from "unique-names-generator";
import { findCustomerByEmail } from "../controllers/customers.controller.js";

export const slotStatuses = {
  EMPTY: "EMPTY",
  WAITING: "WAITING",
  ASSIGNED: "ASSIGNED",
  COMPLETED: "COMPLETED",
};

const PRIVATE_KEY = process.env.SERVICE_API_KEY;

export const generateAuthToken = (id: number) => {
  const token = jwt.sign({ id: id }, PRIVATE_KEY as string);
  return token;
};

export const hashPassword = async (password: string) => {
  const salt = randomBytes(16).toString('hex');
  const hashedPassword = await scryptAsync(password, salt, 64);
  return hashedPassword.toString();
};

export const compareHashedPassword = async (
  string: string,
  encryptedString: string,
) => {
  const [salt, hash] = encryptedString.split(':');
  const hashedString = await scryptAsync(string, salt, 64);
  return hashedString.toString() === hash;
};

export const createTodaysDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const day = today.getDate();

  const todaysDate = `${year}-${month}-${day}`;

  return todaysDate;
};

export const generateProductCategoryId = (category: string) => {
  switch (category.toLowerCase().replace(/\s+/g, "-")) {
    case "accessories":
      return 1;
    case "apparel":
      return 2;
    case "edibles":
      return 3;
    case "cartridges":
      return 4;
    case "cbd":
      return 5;
    case "concentrates":
      return 6;
    case "drinkables":
      return 7;
    case "capsules":
      return 8;
    case "flower":
      return 9;
    case "pre-roll":
      return 10;
    case "pre-rolls":
      return 10;
    case "topicals-tinctures":
      return 11;
    case "extracts":
      return 12;
    case "shake-trim":
      return 13;
    case "packaging":
      return 14;
    default:
      return 999;
  }
};

export const generateStrainTypeCategoryId = (category: string) => {
  switch (category.toLowerCase().replace(" ", "-")) {
    case "indica":
      return 1;
    case "sativa":
      return 2;
    case "hybrid":
      return 3;
    case "hybrid-indica":
      return 4;
    case "hybrid-sativa":
      return 5;
    case "cbd":
      return 6;
    default:
      return 999;
  }
};

const indicaArray = ["indica", "i"];
const sativaArray = ["sativa", "s"];
const hybridArray = ["hybrid", "h"];
const indicaHybridArray = ["indica-hybrid", "hybrid-indica", "ih"];
const sativaHybridArray = [
  "sativa-hybrid",
  "hybrid-sativa",
  "sh",
  "hybrid sativa",
  "Hybrid Sativa",
  "Sativa Hybrid",
];
const cbdArray = ["cbd"];

export const generateStrainTypeCategoryName = (category: string) => {
  switch (category.toLowerCase().replace(/\/|\s|-/g, "-")) {
    case indicaArray.includes(category) ? category : "":
      return "indica";
    case sativaArray.includes(category) ? category : "":
      return "sativa";
    case hybridArray.includes(category) ? category : "":
      return "hybrid";
    case indicaHybridArray.includes(category) ? category : "":
      return "hybrid-indica";
    case sativaHybridArray.includes(category) ? category : "":
      return "hybrid-sativa";
    case cbdArray.includes(category) ? category : "":
      return "cbd";
    default:
      return "no-strain-type";
  }
};

export const normalizePhoneNumber = (phoneNumber: string) => {
  const normalized = phoneNumber.replace(/\D/g, "");

  return `+${normalized}`;
};

export const normalizeDate = (date: Date) => {
  const normalized = date.toISOString().split("T")[0] + "T00:00:00.000Z";

  return normalized;
};

export const generateUniqueName = async () => {
  let randomName = "";
  let existingCustomer = null;
  const numberDictionary = NumberDictionary.generate({ min: 1, max: 999 });
  do {
    randomName = uniqueNamesGenerator({
      dictionaries: [adjectives, colors, animals, numberDictionary],
      // length: 3,
      separator: "_",
      // style: "capital",
    }); // big_red_donkey_123
    existingCustomer = await findCustomerByEmail(randomName);
  } while (existingCustomer);
  return randomName;
};
