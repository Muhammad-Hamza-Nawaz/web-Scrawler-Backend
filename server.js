const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const cors= require("cors")
const app = express();
const PORT = 3000;
app.use(cors());

app.get("/api/bbc-articles", async (req, res) => {
  try {
    
    const response = await axios.get("https://www.bbc.com", {
        headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" }
      });
      
    
    const html = response.data;
    const $ = cheerio.load(html);
    
    const articles = [];

    $(".sc-93223220-0").each((index, element) => {
      const heading = $(element).find('h2').text().trim(); 
      const description = $(element).find('p').text().trim() || "No description available"; 

      articles.push({ heading, description }); 
    });

  
    res.json(articles);
  } catch (error) {
    console.error("Error fetching BBC website:", error.message);
    res.status(500).json({ message: "Error fetching data" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
