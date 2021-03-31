import * as imageToBase64 from 'image-to-base64';
import { Complaint } from './Complaint';
import { ParsedComplaint } from './ParsedComplaint';


export class ParserComplaints {
    async convertImageToBase64(complaints: Array<Complaint>): Promise<ParsedComplaint> {
        let queueBase64Resolve = [];
        let height = 0;
        for(let i = 0; i < complaints.length; i++) {
            if(complaints[i].image !== null) {
                queueBase64Resolve.push(imageToBase64(complaints[i].image));
            }
        }
        await Promise.all(queueBase64Resolve);
        for(let i = 0; i < complaints.length; i++) {
            if(complaints[i].image !== null) {
                complaints[i].image = await queueBase64Resolve.shift();
                height += 500;
            } else {
                height += 290;
            }
        }
        let parsedComplaint: ParsedComplaint = {complaints, height};
        return parsedComplaint;
    }
}
