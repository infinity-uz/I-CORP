import express from "express";
import axios from "axios";
import { connect } from "@ngrok/ngrok";

const app = express();
app.use(express.json());

const ICORP_URL = "https://test.icorp.uz/interview.php";
const PORT = 3333;
let second = null;

app.post("/i-corp", (req, res) => {
    second = req.body.part2;
    res.send("OK").status(200);    
});

app.get("/i-corp", (req, res) => {
    second = req.query.part2;
    res.send("OK").status(200);
});

async function main() {
    try {
        const server = app.listen(PORT, console.log(`Server is listening PORT:`,PORT));

        const ngrok = await connect({
            addr: PORT,
            authtoken: "32x5qrhXi35kLkPH35oTr2OEAva_6JdSSeTuMLQyZuWBYCWc3",
        });
        const url = ngrok.url();

        const ngrokData = {
            msg: "i-corp",
            url: `${url}/i-corp`,
        };

        const post = await axios.post(ICORP_URL, ngrokData);

        const first = post.data.part1;

        let time = 0;
        while (!second && time < 60000) {
            await new Promise((resolve) => setTimeout(resolve, 500));
            time += 500;
        }

        if (!second) {
            process.exit(1);
        }

        const conCat = first + second;
        const data = await axios.get(ICORP_URL, {
            params: { code: conCat },
        });

        console.log(data.data);
        server.close();
        process.exit(0);
    } catch (error) {
        console.log(`Server error: ${error.message}`);
        process.exit(1);
    }
}

main();