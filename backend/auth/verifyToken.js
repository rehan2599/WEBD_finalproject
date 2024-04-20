import jwt from "jsonwebtoken";
import Doctor from "../models/DoctorSchema.js";
import User from "../models/UserSchema.js";

export const authenticate = async (req, res, next) => {
  const authToken = req.headers.authorization;

  if (!authToken || !authToken.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ success: false, message: "No token, authorization denied" });
  }

  try {

    // console.log (authToken);
    const token = authToken.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    req.userId = decoded.id;
    req.role = decoded.role;

    next();

  } catch (err) {
    res.status(401).json({
      success: false,
      message: "Invalid token"
    });
  }
};

export const restrict = roles => async (req, res, next) => {
  const userId = req.userId;
  
  let user;

  const patient = await User.findById(userId)
  const doctor = await Doctor.findById(userId)


  if(patient){
    user = patient;
  }
  if (doctor){
    user = doctor;
  }

  if ( !roles.includes(user.role)) {
      return res
      .status(401)
      .json({ success: false, message: "You're not authorized" });
    }


    //ALTERNATIVE RESTRICT TO REMEBER WHEN DEBUGGING ANY ERROR ON LATER STAGES 
  // try {
  //   user = await User.findById(userId);
  //   if (!user) {
  //     user = await Doctor.findById(userId);
  //   }
    
  //   if (!user || !roles.includes(user.role)) {
  //     return res
  //       .status(401)
  //       .json({ success: false, message: "You're not authorized" });
  //   }

    next();


  // } catch (err) {
  //   res.status(500).json({
  //     success: false,
  //     message: "Error accessing the database"
  //   });
  // }
};