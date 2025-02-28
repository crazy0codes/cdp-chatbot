const express = require("express");
const lunr = require("lunr");
const fs = require("fs");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: "*", methods: ["GET", "POST"] }));

const cdps = ["segment", "mparticle", "lytics", "zeotap"];
const indexes = {};
const store = {};

cdps.forEach((cdp) => {
    try {
        const data = JSON.parse(fs.readFileSync(`data/${cdp}.json`));
        store[cdp] = {};
        indexes[cdp] = lunr(function () {
            this.ref("section");
            this.field("content");
            data.forEach((doc) => {
                this.add(doc);
                store[cdp][doc.section] = doc.content;
            });
        });
    } catch (error) {
        console.error(`Error loading data for ${cdp}:`, error.message);
    }
});

app.post("/ask", (req, res) => {
    const { question } = req.body;
    const lowerQ = question.toLowerCase();

    const cdp = cdps.find((c) => lowerQ.includes(c));
    if (!cdp) {
        return res.json({
            answer: "Please specify a CDP (Segment, mParticle, Lytics, or Zeotap).",
        });
    }

    const keywords = lowerQ
        .replace(cdp, "")
        .split(" ")
        .filter((word) => !["how", "do", "i"].includes(word));
    
    const results = indexes[cdp].search(keywords.join(" "));
    
    const answer = results.length
        ? store[cdp][results[0].ref] || "No relevant info found."
        : "No relevant info found.";

    res.json({ answer, source: `${cdp} - ${results[0]?.ref || "Unknown"}` });
});

app.listen(3000, () => console.log("Server running on port 3000"));
