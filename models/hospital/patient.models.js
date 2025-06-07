import mongoose from "mongoose";
const patientSchema = new mongoose.Schema({
    name: {
        type: String,   
        required: true,
    },
    age: {
        type: Number,
        required: true,
    },
    diagnosedWith: {
        type: String,
        required: true,
    },
    contactNumber: {
        type: String,
        required: true,
        unique: true,
    },
    bloodGroup: {
        type: String,
        required: true,
        enum: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'],
    },
    email: {   
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    gender: {
        type: String,
        required: true,
        enum:["M","F","O"],
    },
    address: {
        type: String,
        required: true,
    },
    admittedIn: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Hospital",
        required: true,
    },
    doctorAssigned: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Doctor",
        required: true,
    },
}, { timestamps: true });
export const Patient = mongoose.model("Patient", patientSchema);