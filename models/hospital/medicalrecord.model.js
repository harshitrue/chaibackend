import mongoose from 'mongoose';
const medicalSchema = new mongoose.Schema({
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
}, { timestamps: true });
export const MedicalRecord = mongoose.model('MedicalRecord', medicalSchema);