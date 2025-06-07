import mongoose from "mongoose";    
const hospitalSchema = new mongoose.Schema({
    name: {type: String, required: true },
    address: {type: String, required: true },
    contactNumber: {type: String, required: true, unique: true },
    email: {type: String, required: true, unique: true, lowercase: true },
    establishedYear: {type: Number, required: true },
    departments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Department",
    }],
    doctors: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Doctor",
    }],
    patients: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Patient",
    }],
}, { timestamps: true });
export const Hospital = mongoose.model("Hospital", hospitalSchema);