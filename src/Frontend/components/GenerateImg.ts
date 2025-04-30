import { useState } from "react";


function Image(){

    const [Img , setImg] = useState("");
    const [colorizedImage , setColorizedImage] = useState("");
    const [loading , setLoading] = useState(false);

    const generateImg = async (e: React.FormEvent, prompt: string) => {
      e.preventDefault();
      setLoading(true)
    
      try {
        const formData = new FormData();
        formData.append("prompt", prompt);
    
        const response = await fetch("http://localhost:8000/generate", {
          method: "POST",
          body: formData, // 🔹 trimitem ca form, NU JSON
        });
    
        const data = await response.json();
        console.log(data);
    
        // Exemplu: http://localhost:8000/images/abc123.png
        setImg(data.image_url);
        setLoading(false)
      } catch (error) {
        console.error("Eroare la generare imagine:", error);
      }
    };
    

  const handleColorizer = async (e: React.FormEvent ,file :File) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("image" , file);
    try {
      const response = await fetch("https://api.deepai.org/api/colorizer", {
        method: "POST",
        headers: {
        },
        body: formData,
      });
      const data = await response.json();
      setColorizedImage(data.output_url);
    } catch (error) {
      console.log(error);
    }
  };



    const downloadImgLogic =  async (img: string , type:string) => {
      try {
        const response = await fetch(img);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${type}${Date.now()}.jpg`;
        document.body.appendChild(a);
        a.click(); //ce sunt astea
        a.remove(); //
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error("Error downloading the image:", error);
      }
    }

  return {Img , colorizedImage,loading, generateImg , handleColorizer, downloadImgLogic};

  
}
export default Image