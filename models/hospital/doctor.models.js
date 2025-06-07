import mongoose from 'mongoose';
const doctorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    specialization: {
        type: String,
        required: true,
        trim: true,
    },
    contactNumber: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    hospitalId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hospital',
        required: true,
    },
    salary: {
        type: Number,
        required: true,
    },
    yearsOfExperience: {
        type: Number,
        required: true,
    },
    qualifications: [{
        degree: {
            type: String,
            required: true,
        },
        institution: {
            type: String,
            required: true,
        },
        yearOfPassing: {
            type: Number,
            required: true,
        },
    }],
    worksInHospitals: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hospital',
        required: true,
    }],
}, { timestamps: true });
export const Doctor = mongoose.model('Doctor', doctorSchema);