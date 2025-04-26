import "./App.css";
import ScrollHideHeader from "./Scrolling-hide-header.tsx";

import { useEffect, useState } from "react";
import Image from "./components/GenerateImg.ts"

function HomePage() {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [Promth, setPromth] = useState("");

 // const [Img , colorizedImage, generateImg ,  handleColorizer] = Image();
  const { Img, colorizedImage, generateImg, handleColorizer , downloadImgLogic} = Image(); // dc asa

  const api_key = import.meta.env.VITE_DEEPAI_API_KEY;
  



  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };
 
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <main>
      <ScrollHideHeader />
      <div className="content">
        <div className="section-one parallax-section">
          <div
            className="parallax-background"
            style={{
              transform: `translateY(${scrollPosition * 0.4}px)`
            }}
          />
          <div className="parallax-content">
            <h1>Transform your vision into art</h1>
            <h3 className="paragraf">
              Create stunning AI-generated image or bring your black & white photos
              to life with our advanced colorization technology
            </h3>
          </div>
        </div>

        <div className="section-two">
            <form className="text2img-form" onSubmit={(e) => generateImg(e , Promth , api_key)}>
                <h2 className="textsec2">Text to Image</h2>
                <input
                style={{
                  backgroundColor: "white",
                  color: "black",
                  justifyContent: "center",
                  alignContent: "center",
                }}
                type="text"
                placeholder="Enter your promth here"
                value={Promth}
                onChange={(e) => setPromth(e.target.value)}
                />
                {Img && <img src={Img} alt="Generated result" />}
                {Img && (
                <button type="button" onClick={() => downloadImgLogic(Img, "Generated_Img")}>
                  Download Colorized Image
                </button>
              )}
              <button>Generate</button>
            </form>
            <form className="blacktocolor-form" onSubmit = {(e) => {
              e.preventDefault();

              const fileInput = e.currentTarget.querySelector('input[type="file"]') as HTMLInputElement; // ce este input[type]
              const file = fileInput?.files?.[0] // ce sunt semnele intrebarii
              if(file)
              {
                handleColorizer(e , api_key , file)
              }
            }}>
              <h2 className="textsec2">Black & White to Color</h2>
              <input type="file" accept="image/*" />
              <img src={colorizedImage}/>
              {colorizedImage && (
                <button type="button" onClick={() => downloadImgLogic(colorizedImage, "Colorized_Image")}>
                  Download generated image
                </button>
              )}
              
              <button type="submit">Generate</button>
            </form>
        </div>
      </div>
    </main>
  );
}
export default HomePage;