import { Complaint } from './Complaint';
import { ParsedComplaint } from './ParsedComplaint';

/* eslint @typescript-eslint/no-var-requires: 0 */
const imageToBase64 = require('image-to-base64');

export class ParserComplaints {
    async convertImageToBase64(complaints: Array<Complaint>): Promise<ParsedComplaint> {
        const queueBase64Resolve = [];
        let height = 0;
        for(let i = 0; i < complaints.length; i++) {
            if(complaints[i].picture !== null) {
                queueBase64Resolve.push(imageToBase64(complaints[i].picture));
                height += 500;
            }
            else {
                height += 290;
            }
        }
        if (queueBase64Resolve.length > 0) {
            await Promise.all(queueBase64Resolve);
            for(let i = 0; i < complaints.length; i++) {
                if(complaints[i].picture !== null) {
                    complaints[i].picture = await queueBase64Resolve.shift();
                }
            }
        }
        const parsedComplaint: ParsedComplaint = {complaints, height};
        return parsedComplaint;
    }
}
