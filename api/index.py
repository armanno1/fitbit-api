from fastapi import FastAPI, Request, Response, HTTPException
from pydantic import BaseModel, Field
from typing import List 
import pandas as pd
import io

class Activity(BaseModel):
    dateTime: str
    value: dict

class HeartRateData(BaseModel):
    activities_heart: List[Activity] = Field(alias="activities-heart")

app = FastAPI()

@app.post("/api")
async def root(request: Request):
    try: 
        data_dict = await request.json()
        heart_rate_data = HeartRateData(**data_dict)
        # so the above should really raise a validation error I guess

        all_data = []

        for day in heart_rate_data.activities_heart: # use dot notation for pydantic models
            row = {'date': day.dateTime}

            # handle potential missing 'restingHeartRate'
            if 'restingHeartRate' in day.value:
                resting_heart_rate = day.value["restingHeartRate"]
                row['resting_heart_rate'] = resting_heart_rate

            # iterate through each heart rate zone 
            for zone in day.value["heartRateZones"]:
                zone_name = zone["name"]
                if 'caloriesOut' in zone:  
                    row[f'{zone_name}_caloriesOut'] = zone["caloriesOut"]
                if 'minutes' in zone:  
                    row[f'{zone_name}_minutes'] = zone["minutes"]

            all_data.append(row)
            
        df = pd.DataFrame(all_data)
        csv_buffer = io.StringIO()
        df.to_csv(csv_buffer)
        response = Response(status_code=200, content=csv_buffer.getvalue(), media_type="text/csv", headers={"Content-Disposition": "attachment; filename=heart_rate_data.csv"})
        print(response.headers)
        return response
    except: 
        raise HTTPException(status_code=400, detail="Error")

