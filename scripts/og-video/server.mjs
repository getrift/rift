// Serves render.html to a headless Chrome and turns the frames it posts into an MP4.
// Started by run.sh: node server.mjs <port> <out.mp4> [still.png]. CRF=26 sets the quality.
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";

const [port, outFile, stillFile] = [Number(process.argv[2]), process.argv[3], process.argv[4]];
const here = path.dirname(new URL(import.meta.url).pathname);

const ffmpeg = stillFile ? null : spawn("ffmpeg", [
  "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "rgba", "-s", "1200x630", "-r", "30", "-i", "-",
  "-c:v", "libx264", "-preset", "slow", "-crf", process.env.CRF ?? "22", "-pix_fmt", "yuv420p", "-movflags", "+faststart", outFile,
], { stdio: ["pipe", "inherit", "inherit"] });
let frames = 0;

const body = (req) => new Promise((resolve) => { const parts = []; req.on("data", (c) => parts.push(c)); req.on("end", () => resolve(Buffer.concat(parts))); });

http.createServer(async (req, res) => {
  const url = new URL(req.url, "http://x");
  if (req.method === "GET") {
    if (url.pathname !== "/") { res.writeHead(404).end(); return; }
    res.writeHead(200, { "content-type": "text/html" });
    fs.createReadStream(path.join(here, "render.html")).pipe(res);
    return;
  }
  const data = await body(req);
  if (url.pathname === "/frame") {
    frames++;
    if (!ffmpeg.stdin.write(data)) await new Promise((r) => ffmpeg.stdin.once("drain", r));
  } else if (url.pathname === "/still") {
    fs.writeFileSync(stillFile, data);
  } else if (url.pathname === "/done") {
    res.writeHead(200).end();
    if (ffmpeg) { ffmpeg.stdin.end(); ffmpeg.on("close", (code) => { console.log(`frames ${frames}, ffmpeg ${code}`); process.exit(code ?? 0); }); }
    else { console.log("still written"); process.exit(0); }
    return;
  }
  res.writeHead(200).end();
}).listen(port, () => console.log(`listening ${port}`));
