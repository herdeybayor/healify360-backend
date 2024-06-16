import Joi from "joi";
import { Request } from "express";

import CustomError from "@/utilities/custom-error";
import AppointmentModel from "@/models/appointment.model";
import PrescriptionModel, { MEDICATION_FORM } from "@/models/prescription.model";

class PrescriptionService {
    async create({ body, $currentUser, $currentDoctorProfile }: Partial<Request>) {
        const { error, value: data } = Joi.object({
            body: Joi.object({
                text: Joi.string().required(),
                appointment_id: Joi.string().required(),
                medications: Joi.array().items(
                    Joi.object({
                        name: Joi.string().required(),
                        dosage: Joi.string().required(),
                        quantity: Joi.string().required(),
                        usage_instruction: Joi.string().required(),
                        form: Joi.string()
                            .valid(...Object.values(MEDICATION_FORM).map((form) => form.enumValue))
                            .required(),
                    })
                ),
            }),
            $currentUser: Joi.object({
                _id: Joi.required(),
            }).required(),
            $currentDoctorProfile: Joi.object({
                _id: Joi.required(),
            }).required(),
        })
            .options({ stripUnknown: true })
            .validate({ body, $currentUser, $currentDoctorProfile });
        if (error) throw new CustomError(error.message, 400);

        const existingPrescription = await PrescriptionModel.findOne({ appointment_ref: data.body.appointment_id });
        if (existingPrescription) throw new CustomError("Prescription already given");

        const appointment = await AppointmentModel.findOne({ _id: data.body.appointment_id });
        if (!appointment) throw new CustomError("Appointment not found", 404);

        if (String(data.$currentUser._id) !== String(appointment.doctor_ref)) throw new CustomError("Only appointment doctor can give prescription");

        const createContext = {
            text: data.body.text,

            medications: data.body.medications,

            appointment_ref: appointment._id,

            doctor_ref: appointment.doctor_ref,
            doctor_profile_ref: appointment.doctor_profile_ref,

            patient_ref: appointment.patient_ref,
            patient_profile_ref: appointment.patient_profile_ref,
        };

        const prescription = await new PrescriptionModel(createContext).save();

        return prescription;
    }

    async getOneById({ params }: Partial<Request>) {
        const { error, value: data } = Joi.object({
            params: Joi.object({
                prescriptionId: Joi.string().required(),
            }),
        })

            .options({ stripUnknown: true })
            .validate({ params });
        if (error) throw new CustomError(error.message, 400);

        const prescription = await PrescriptionModel.findOne({ _id: data.params.prescriptionId });
        if (!prescription) throw new CustomError("Prescription not found", 404);

        return prescription;
    }

    async getOneByAppointmentId({ params }: Partial<Request>) {
        const { error, value: data } = Joi.object({
            params: Joi.object({
                appointmentId: Joi.string().required(),
            }),
        })

            .options({ stripUnknown: true })
            .validate({ params });
        if (error) throw new CustomError(error.message, 400);

        const prescription = await PrescriptionModel.findOne({ appointment_ref: data.params.appointmentId });

        return prescription;
    }
}

export default new PrescriptionService();
