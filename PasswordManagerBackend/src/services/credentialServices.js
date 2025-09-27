import Users from "../models/Users.js";
import Credential from "../models/Credential.js";
import ApiResponse from "../utils/apiResponse.js";
import {
  decryptSitePassword,
  encryptSitePassword,
  verifyMasterPassword,
} from "../utils/common.js";

export const createCredService = async (credData, res) => {
  try {
    const userDetail = await Users.findOne({ username: credData.user });
    const encryptedPassword = encryptSitePassword(
      process.env.SECRET_KEY,
      credData.password
    );
    const createCred = await Credential.create({
      ...credData,
      userId: userDetail._id,
      password: encryptedPassword.encrypted,
      iv: encryptedPassword.iv,
    });
    return ApiResponse.success(
      res,
      createCred,
      "Credential fetched successfully 🤗",
      200
    );
  } catch (error) {
    return ApiResponse.error(res, error.message, 500);
  }
};

export const decryptCredService = async (reqData, res) => {
  const { credId, userPass } = reqData;
  try {
    const credDetail = await Credential.findOne({ _id: credId }).lean(); // returns plain JS object Use .toObject() or .lean()
    const user = await Users.findOne({ _id: credDetail.userId });
    const isValidUser = await verifyMasterPassword(userPass, user.password);
    if (isValidUser) {
      const decryptPassword = decryptSitePassword(
        process.env.SECRET_KEY,
        credDetail.password,
        credDetail.iv
      );
      const viewCredWithPassword = { ...credDetail, password: decryptPassword };
      return ApiResponse.success(
        res,
        viewCredWithPassword,
        "Credential fetched successfully 🤗",
        200
      );
    } else {
      return ApiResponse.error(res, "Credential not match 😒", 400);
    }
  } catch (error) {
    return ApiResponse.error(res, error.message, 500);
  }
};

export const getCredService = async (MasterUsername, res) => {
  try {
    const credDetail = await Users.findOne({ username: MasterUsername });
    if (!credDetail) {
      return ApiResponse.error(res, "You don't have any credential 😒", 400);
    }
    const allCred = await Credential.find({userId: credDetail._id})
    return ApiResponse.success(
      res,
      allCred,
      "Credential fetched successfully 🤗",
      200
    );
  } catch (error) {
    return ApiResponse.error(res, error.message, 500);
  }
};
