import { Complaint } from './Complaint';

export interface ParsedComplaint {
	complaints: Array<Complaint>;
	height: number;
}
