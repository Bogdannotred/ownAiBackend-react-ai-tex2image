from fastapi import FastAPI, Form
from fastapi.middleware.cors import CORSMiddleware
from diffusers import StableDiffusionPipeline
import torch
import uuid
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


if not os.path.exists("images"):
    os.makedirs("images")


pipe = StableDiffusionPipeline.from_pretrained("stabilityai/stable-diffusion-2-1-base")
pipe = pipe.to("cpu")

@app.post("/generate")
async def generate(prompt: str = Form(...)):
    image = pipe(prompt, num_inference_steps=5).images[0]
    file_name = f"images/{uuid.uuid4()}.png"
    image.save(file_name)
    return {"image_url": f"http://localhost:8000/{file_name}"}

from fastapi.staticfiles import StaticFiles
app.mount("/images", StaticFiles(directory="images"), name="images")
