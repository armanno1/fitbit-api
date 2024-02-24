from fastapi import FastAPI

app = FastAPI()

@app.get("/api/test")   # A simple GET endpoint
def hello_world():
    return {"message": "Hello from your FastAPI!"}
