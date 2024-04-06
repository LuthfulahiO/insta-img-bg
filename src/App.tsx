import { useState } from "react";
import "./App.css";

function App() {
  const [image, setImage] = useState<string | null>(null);
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      const image = new Image();
      image.src = e.target?.result as string;
      image.onload = () => {
        canvas.width = image.width;
        canvas.height = image.height;
        if (!context) return;
        context.drawImage(image, 0, 0);
        const imageData = context.getImageData(
          0,
          0,
          canvas.width,
          canvas.height
        );

        const colorCount: { [key: string]: number } = {};
        const data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {
          const key = `rgb(${data[i]}, ${data[i + 1]}, ${data[i + 2]})`;
          colorCount[key] = (colorCount[key] || 0) + 1;
        }

        const colorEntries = Object.entries(colorCount);
        colorEntries.sort((a, b) => b[1] - a[1]);

        const colors = colorEntries.map((entry) => entry[0]);

        const topColors = colors.slice(0, 3);

        const radialGradient = topColors.map(
          (color, index) =>
            `${color} ${index * (100 / (topColors.length - 1))}%`
        );

        document.body.style.background = `radial-gradient(circle, ${radialGradient})`;

        const dataUrl = canvas.toDataURL("image/png");
        setImage(dataUrl);
      };
    };

    reader.readAsDataURL(file);
  };

  return (
    <div>
      {!image && <h1 style={{ color: "#000000" }}>Sample image background</h1>}
      <label
        htmlFor="fileUpload"
        style={{
          cursor: "pointer",
          backgroundColor: "#000000",
          padding: "12px",
          borderRadius: "8px",
        }}
      >
        Upload Image
      </label>
      <input
        id="fileUpload"
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        style={{ display: "none" }}
      />
      {image && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            overflow: "hidden",
            marginTop: "20px",
            // height: "100vh",
            width: "100%",
            maxWidth: "100%",
          }}
        >
          <img
            src={image}
            alt="Image preview"
            style={{ width: "100%", height: "auto" }}
          />
        </div>
      )}
    </div>
  );
}

export default App;
