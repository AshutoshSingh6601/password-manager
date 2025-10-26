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

export const verifyMasterPassService = async (credData, res) => {
  try {
    const userDetail = await Users.findOne({ username: credData.user });
    const encryptedPassword = await verifyMasterPassword(
      credData.password,
      userDetail.password
    );
    if(encryptedPassword){
      return res.status(200).json({status: "success", message: "Verified", isVerified: encryptedPassword})
    }
    return ApiResponse.error(
      res,
      "Invalid Credential 😒",
      400
    );
  } catch (error) {
    return ApiResponse.error(res, error.message, 500);
  }
};

export const decryptCredService = async (reqData, res) => {
  const { credId } = reqData;
  try {
    const credDetail = await Credential.findOne({ _id: credId }).lean(); // returns plain JS object Use .toObject() or .lean()
    if (credDetail) {
      const decryptPassword = decryptSitePassword(
        process.env.SECRET_KEY,
        credDetail.password,
        credDetail.iv
      );
      const viewCredWithPassword = { ...credDetail, password: decryptPassword };
      return ApiResponse.success(
        res,
        viewCredWithPassword,
        "Password Decoded successfully 🤗",
        200
      );
    } else {
      return ApiResponse.error(res, "Cred id not match 😒", 400);
    }
  } catch (error) {
    return ApiResponse.error(res, error.message, 500);
  }
};

export const updateSpecificCredService = async (reqData, res) => {
  const { websiteURL, websiteName, email, username, password, credId } = reqData;
  try {
     let encryptUpdatedPass
    if(password){
      encryptUpdatedPass = await encryptSitePassword(process.env.SECRET_KEY, password)
    }
      const updatedCredWithEncryptedPass = { websiteName, websiteURL, email, username, password: encryptUpdatedPass?.encrypted, iv: encryptUpdatedPass?.iv };
      const credDetail = await Credential.findOneAndUpdate({ _id: credId }, updatedCredWithEncryptedPass);
      // const credDetail = await Credential.updateOne({ _id: credId }, { $set: updatedCredWithEncryptedPass });
      if(credDetail){
      return ApiResponse.success(
        res,
        credDetail,
        "Credential Updated successfully 🤗",
        200
      );
      } else {
      return ApiResponse.error(res, "Credential id not match 😒", 400);
    }
  } catch (error) {
    return ApiResponse.error(res, error.message, 500);
  }
};

export const deleteSpecificCredService = async (reqData, res) => {
  const { credId } = reqData;
  try {

    const credDetail = await Credential.findOneAndDelete({_id: credId})
    if(credDetail){
    return ApiResponse.success(
        res,
        credDetail,
        "Credential Deleted successfully 🤗",
        200
      );
      } else {
      return ApiResponse.error(res, "Credential id not match 😒", 400);
    }
  } catch (error) {
    return ApiResponse.error(res, error.message, 500);
  }
};

export const getAllCredsService = async (MasterUsername, res) => {
  try {
     const credDetail = await Users.findOne({ username: MasterUsername });
    if (!credDetail) {
      return ApiResponse.error(res, "User not found 😒", 400);
    }
    const allCred = await Credential.find({userId: credDetail._id}).lean()
    const decryptedPass = allCred.map((cred)=>{
      const decryptPassword = decryptSitePassword(
        process.env.SECRET_KEY,
        cred.password,
        cred.iv
      );
      return {...cred, password:decryptPassword}
    })
    if (allCred) {
      return ApiResponse.success(
        res,
        decryptedPass,
        "Password Decoded successfully 🤗",
        200
      );
    } else {
      return ApiResponse.error(res, "You don't have any credential 😒", 400);
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
    // return ApiResponse.success(
    //   res,
    //   allCred,
    //   "Credential fetched successfully 🤗",
    //   200
    // );
    return res.status(200).json({status: 'success', message: "Credential fetched successfully 🤗", masterUser: MasterUsername, data: allCred})
  } catch (error) {
    return ApiResponse.error(res, error.message, 500);
  }
};
