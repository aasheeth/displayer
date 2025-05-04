from fastapi import FastAPI, Query
from fastapi.responses import JSONResponse, PlainTextResponse, Response
from fastapi.middleware.cors import CORSMiddleware
import httpx
import dicttoxml

app = FastAPI()

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DUMMY_JSON_URL = "https://dummyjson.com/users"

async def fetch_users(limit: int, skip: int):
    async with httpx.AsyncClient() as client:
        response = await client.get(f"{DUMMY_JSON_URL}?limit={limit}&skip={skip}")
        response.raise_for_status()
        return response.json()

@app.get("/api/json")
async def get_json_data(limit: int = Query(10), skip: int = Query(0)):
    data = await fetch_users(limit, skip)
    return JSONResponse(content=data)

@app.get("/api/string")
async def get_string_data(limit: int = Query(10), skip: int = Query(0)):
    data = await fetch_users(limit, skip)
    users = data.get("users", [])
    string_data = "\n".join(
        f"{user['id']}: {user['firstName']} {user['lastName']} - {user['email']}" for user in users
    )
    total = data.get("total", len(users))
    headers = {"X-Total-Count": str(total)}
    return PlainTextResponse(content=string_data, headers=headers)


@app.get("/api/xml")
async def get_xml_data(limit: int = Query(10), skip: int = Query(0)):
    data = await fetch_users(limit, skip)
    xml_data = dicttoxml.dicttoxml(data, custom_root='users', attr_type=False)
    return Response(content=xml_data, media_type="application/xml")
