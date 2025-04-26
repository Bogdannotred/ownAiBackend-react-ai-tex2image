import { useState } from "react";


function Image(){

    const [Img , setImg] = useState("");
    const [colorizedImage , setColorizedImage] = useState("");

 const generateImg = async (e: React.FormEvent , Promth : string , api_key : string) => {
    e.preventDefault();

    try {
      const response = await fetch("https://api.deepai.org/api/text2img", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-key": api_key
        },
        body: JSON.stringify({
          text: Promth,
        }),
      });
      const data = await response.json();
      setImg(data.output_url);
    } catch (error) {
      console.log(error);
    }
  };

  const handleColorizer = async (e: React.FormEvent , api_key:string ,file :File) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("image" , file);
    try {
      const response = await fetch("https://api.deepai.org/api/colorizer", {
        method: "POST",
        headers: {
          "api-key": api_key,
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

  return {Img , colorizedImage, generateImg , handleColorizer, downloadImgLogic};

  
}
export default Image