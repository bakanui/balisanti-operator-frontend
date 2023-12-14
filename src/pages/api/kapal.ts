import { API_MASTER_DATA } from '@/app/utils/api';
import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    const requestMethod = req.method;
    // const body = JSON.parse(req.body);
    switch (requestMethod) {
      case 'POST':
        res.status(200).json({ message: `You submitted the following data: ` })
        
      // handle other HTTP methods
      default:
        let requestMethod = axios.get<any>(API_MASTER_DATA.KAPAL,
        {
            headers: {
                Authorization: `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vMTAzLjQ5LjIzOS4xMTAvYXBpL2xvZ2luIiwiaWF0IjoxNjc3MjkwMDc4LCJleHAiOjE2NzcyOTM2NzgsIm5iZiI6MTY3NzI5MDA3OCwianRpIjoiVU1iOFZacFBpWFdUN0x0UCIsInN1YiI6IjIiLCJwcnYiOiIyM2JkNWM4OTQ5ZjYwMGFkYjM5ZTcwMWM0MDA4NzJkYjdhNTk3NmY3In0.1eIDbpvOGPdyyMw4TVhYdCCtsIIaRqM-PSMK0EKhwc8`,
            },
            // params
        });
        res.status(200).json({ message: requestMethod});
    }
  }