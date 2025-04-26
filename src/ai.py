# ai.py
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.staticfiles import StaticFiles
from diffusers import StableDiffusionPipeline, EulerDiscreteScheduler
import torch
import os

app = FastAPI()

# Creează folderul static dacă nu există
if not os.path.exists("static"):
    os.makedirs("static")

# MODEL MAI MIC
model_id = "stabilityai/stable-diffusion-2-1-base"

# Scheduler mai rapid decât default-ul
scheduler = EulerDiscreteScheduler.from_pretrained(model_id, subfolder="scheduler")

# Încarcă pipeline-ul cu modelul mic
pipe = StableDiffusionPipeline.from_pretrained(
    model_id,
    scheduler=scheduler,
    torch_dtype=torch.float32,  # pentru CPU
)

# Mută modelul pe CPU
pipe = pipe.to("cpu")

# Optimizează puțin pe CPU
torch.set_grad_enabled(False)

# Servește fișiere statice
app.mount("/static", StaticFiles(directory="static"), name="static")

# Model pentru request
class PromptRequest(BaseModel):
    prompt: str

# Endpoint de generare imagine
@app.post("/generate")
async def generate_image(req: PromptRequest):
    # Generează imaginea
    pipe_output = pipe(prompt=req.prompt, num_inference_steps=20, guidance_scale=7.5)
    image = pipe_output.images[0]
    
    # Salvează imaginea
    image_path = "static/generated_image.png"
    image.save(image_path)
    
    return {"image_url": "/static/generated_image.png"}
