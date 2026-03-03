import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import multer from "multer";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://TechTreck:techtreck%40cse@cluster0.zixgaqv.mongodb.net/?appName=Cluster0";
const JWT_SECRET = process.env.JWT_SECRET || "techtreck-secret-2024";

// MongoDB Schemas
const commonSchemaOptions = {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
};

const teamSchema = new mongoose.Schema({
  name: { type: String, unique: true, required: true },
  member1: String,
  member2: String,
  member3: String,
  round1_score: { type: Number, default: 0 },
  round2_score: { type: Number, default: 0 },
  round3_score: { type: Number, default: 0 },
  round1_mystery_boxes_opened: { type: [Number], default: [] },
  current_question_index: { type: Number, default: 0 },
  is_finished_r1: { type: Number, default: 0 },
  is_finished_r2: { type: Number, default: 0 }
}, commonSchemaOptions);

const r1QuestionSchema = new mongoose.Schema({
  box_number: { type: Number, unique: true, required: true },
  difficulty: String,
  question_text: String
}, commonSchemaOptions);

const r2QuestionSchema = new mongoose.Schema({
  question_text: String,
  image_url: String,
  option1: String,
  option2: String,
  option3: String,
  option4: String,
  correct_option: Number
}, commonSchemaOptions);

const r3SetSchema = new mongoose.Schema({
  name: { type: String, unique: true, required: true }
}, commonSchemaOptions);

const r3QuestionSchema = new mongoose.Schema({
  set_id: { type: mongoose.Schema.Types.ObjectId, ref: 'R3Set' },
  question_text: String,
  image_url: String
}, commonSchemaOptions);

const adminSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true }
}, commonSchemaOptions);

// Map _id to id for frontend compatibility
const addIdVirtual = (schema: mongoose.Schema) => {
  schema.virtual('id').get(function(this: any) {
    return this._id.toHexString();
  });
};

addIdVirtual(teamSchema);
addIdVirtual(r1QuestionSchema);
addIdVirtual(r2QuestionSchema);
addIdVirtual(r3SetSchema);
addIdVirtual(r3QuestionSchema);
addIdVirtual(adminSchema);

const Team = mongoose.model('Team', teamSchema);
const R1Question = mongoose.model('R1Question', r1QuestionSchema);
const R2Question = mongoose.model('R2Question', r2QuestionSchema);
const R3Set = mongoose.model('R3Set', r3SetSchema);
const R3Question = mongoose.model('R3Question', r3QuestionSchema);
const Admin = mongoose.model('Admin', adminSchema);

async function startServer() {
  // Connect to MongoDB
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB Atlas");
    
    // Default admin initialization
    const adminExists = await Admin.findOne({ username: 'admin' });
    if (!adminExists) {
      await Admin.create({ username: 'admin', password: 'Harini@CSE123' });
    }
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }

  const app = express();
  app.use(express.json());

  // Static files
  const uploadDir = path.join(__dirname, "public", "uploads");
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  app.use("/uploads", express.static(uploadDir));
  app.use(express.static(path.join(__dirname, "public")));

  // Multer config
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, uniqueSuffix + path.extname(file.originalname));
    }
  });
  const upload = multer({ storage });

  // Auth Middleware
  const authenticateToken = (req: any, res: any, next: any) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token || token === 'null' || token === 'undefined') {
      return res.status(401).json({ error: "Authentication required" });
    }

    jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
      if (err) return res.status(403).json({ error: "Invalid token" });
      req.user = user;
      next();
    });
  };

  // API Routes
  app.post("/api/admin/login", async (req, res) => {
    const { username, password } = req.body;
    const admin = await Admin.findOne({ username, password });
    if (admin) {
      const token = jwt.sign({ id: admin._id, username: admin.username }, JWT_SECRET);
      res.json({ token });
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  });

  app.post("/api/admin/reset-password", authenticateToken, async (req, res) => {
    try {
      await Admin.updateOne({ username: 'admin' }, { password: 'Harini@CSE123' });
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/admin/status", authenticateToken, async (req, res) => {
    try {
      const status = {
        teams: { count: await Team.countDocuments() },
        r1MysteryQuestions: { count: await R1Question.countDocuments() },
        r2Questions: { count: await R2Question.countDocuments() },
        r3Sets: { count: await R3Set.countDocuments() },
        r3Questions: { count: await R3Question.countDocuments() }
      };
      res.json(status);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Teams
  app.get("/api/teams", async (req, res) => {
    const teams = await Team.find().sort({ _id: 1 });
    res.json(teams);
  });

  app.post("/api/teams", async (req, res) => {
    const { name, member1, member2, member3 } = req.body;
    try {
      const team = await Team.create({ name, member1, member2, member3 });
      res.json(team);
    } catch (err: any) {
      res.status(400).json({ error: "Team name already exists or invalid data" });
    }
  });

  app.delete("/api/teams/:id", authenticateToken, async (req, res) => {
    await Team.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  });

  app.delete("/api/teams", authenticateToken, async (req, res) => {
    await Team.deleteMany({});
    res.json({ success: true });
  });

  // Scoring
  app.post("/api/quiz/score", async (req, res) => {
    const { team_id, increment, round } = req.body;
    const scoreField = round === 3 ? 'round3_score' : (round === 2 ? 'round2_score' : 'round1_score');
    await Team.findByIdAndUpdate(team_id, { $inc: { [scoreField]: increment } });
    res.json({ success: true });
  });

  app.post("/api/quiz/round1/mystery-box/submit", async (req, res) => {
    const { teamId, boxNumber, isCorrect, score } = req.body;
    const team = await Team.findById(teamId);
    if (!team) return res.status(404).json({ error: "Team not found" });
    
    const opened = team.round1_mystery_boxes_opened || [];
    if (!opened.includes(boxNumber)) {
      opened.push(boxNumber);
    }
    const increment = isCorrect ? score : 0;
    await Team.findByIdAndUpdate(teamId, { 
      $inc: { round1_score: increment },
      $set: { round1_mystery_boxes_opened: opened }
    });
    res.json({ success: true });
  });

  app.post("/api/quiz/round2/submit", async (req, res) => {
    const { teamId, isCorrect } = req.body;
    const increment = isCorrect ? 10 : 0;
    await Team.findByIdAndUpdate(teamId, { $inc: { round2_score: increment } });
    res.json({ success: true });
  });

  app.post("/api/quiz/round3/update-score", async (req, res) => {
    const { teamId, scoreChange } = req.body;
    const increment = scoreChange > 0 ? scoreChange : 0;
    await Team.findByIdAndUpdate(teamId, { $inc: { round3_score: increment } });
    res.json({ success: true });
  });

  app.post("/api/quiz/reset", authenticateToken, async (req, res) => {
    await Team.updateMany({}, { 
      round1_score: 0, 
      round2_score: 0, 
      round3_score: 0, 
      round1_mystery_boxes_opened: [], 
      current_question_index: 0, 
      is_finished_r1: 0, 
      is_finished_r2: 0 
    });
    res.json({ success: true });
  });

  app.post("/api/quiz/reset-r3", authenticateToken, async (req, res) => {
    await Team.updateMany({}, { round3_score: 0 });
    res.json({ success: true });
  });

  // Questions Round 1 (Mystery Box)
  app.get("/api/round1/mystery-box/questions", async (req, res) => {
    const questions = await R1Question.find();
    res.json(questions);
  });

  app.post("/api/round1/mystery-box/questions", authenticateToken, async (req, res) => {
    const { box_number, difficulty, question_text } = req.body;
    try {
      const question = await R1Question.create({ box_number, difficulty, question_text });
      res.json(question);
    } catch (err: any) {
      res.status(400).json({ error: "Box number already exists" });
    }
  });

  app.delete("/api/round1/mystery-box/questions/:id", authenticateToken, async (req, res) => {
    await R1Question.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  });

  app.delete("/api/round1/mystery-box/all", authenticateToken, async (req, res) => {
    await R1Question.deleteMany({});
    res.json({ success: true });
  });

  // Questions Round 2 (Visual Challenge)
  app.get("/api/round2/questions", async (req, res) => {
    const questions = await R2Question.find();
    res.json(questions);
  });

  app.post("/api/round2/questions", authenticateToken, async (req, res) => {
    const { question_text, image_url, option1, option2, option3, option4, correct_option } = req.body;
    const question = await R2Question.create({ question_text, image_url, option1, option2, option3, option4, correct_option });
    res.json(question);
  });

  app.delete("/api/round2/questions/:id", authenticateToken, async (req, res) => {
    await R2Question.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  });

  app.delete("/api/round2/all", authenticateToken, async (req, res) => {
    await R2Question.deleteMany({});
    res.json({ success: true });
  });

  // Questions Round 3
  app.get("/api/round3/sets", async (req, res) => {
    const sets = await R3Set.find();
    res.json(sets);
  });

  app.post("/api/round3/sets", authenticateToken, async (req, res) => {
    try {
      const set = await R3Set.create({ name: req.body.name });
      res.json(set);
    } catch (err: any) {
      res.status(400).json({ error: "Set already exists" });
    }
  });

  app.delete("/api/round3/sets/:id", authenticateToken, async (req, res) => {
    await R3Question.deleteMany({ set_id: req.params.id });
    await R3Set.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  });

  app.get("/api/round3/questions", async (req, res) => {
    const { set_id } = req.query;
    const questions = await R3Question.find({ set_id });
    res.json(questions);
  });

  app.get("/api/round3/questions/:set_id", async (req, res) => {
    const questions = await R3Question.find({ set_id: req.params.set_id });
    res.json(questions);
  });

  app.get("/api/round2/sets", (req, res) => {
    res.json([]);
  });

  app.post("/api/round3/questions", authenticateToken, async (req, res) => {
    const { set_id, question_text, image_url } = req.body;
    const question = await R3Question.create({ set_id, question_text, image_url });
    res.json(question);
  });

  app.delete("/api/round3/questions/:id", authenticateToken, async (req, res) => {
    await R3Question.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  });

  app.delete("/api/round3/all", authenticateToken, async (req, res) => {
    await R3Question.deleteMany({});
    await R3Set.deleteMany({});
    res.json({ success: true });
  });

  // Asset Uploads
  app.post("/api/upload", authenticateToken, upload.single("image"), (req: any, res: any) => {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });
    res.json({ url: `/uploads/${req.file.filename}` });
  });

  app.post("/api/upload-asset", authenticateToken, upload.single("file"), (req: any, res: any) => {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });
    const targetName = req.body.name;
    if (!targetName) return res.status(400).json({ error: "Target name required" });
    
    const targetPath = path.join(__dirname, "public", targetName);
    if (fs.existsSync(targetPath)) {
      fs.unlinkSync(targetPath);
    }
    fs.renameSync(req.file.path, targetPath);
    res.json({ success: true });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  const PORT = 3000;
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

