import { IUser } from "@/models/user.model";
import { IDoctorProfile } from "@/models/doctor-profile.model";
import { IPatientProfile } from "@/models/patient-profile.model";

declare global {
    namespace Express {
        export interface Request {
            $currentUser?: IUser;
            $currentDoctorProfile?: IDoctorProfile;
            $currentPatientProfile?: IPatientProfile;
        }
    }
}
