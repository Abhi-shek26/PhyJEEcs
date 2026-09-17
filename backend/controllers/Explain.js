const Question = require("../models/Question");

// GET /api/explain/:id — AI Analyst: returns stored solution; if empty, returns a
// template prompt the frontend can send to any LLM API (no key committed).
exports.explain = async (req, res) => {
  try {
    const q = await Question.findById(req.params.id).select("title chapter category type difficulty solutionText");
    if (!q) return res.status(404).json({ error: "Question not found" });
    if (q.solutionText) return res.json({ source: "stored", solution: q.solutionText, question: q });
    const prompt = `You are a JEE Physics tutor. Explain step-by-step how to solve this problem. Question code ${q.title}, chapter ${q.chapter}, category ${q.category}, type ${q.type}, difficulty ${q.difficulty}. List the concept, formula, steps, and final answer format.`;
    res.json({ source: "llm-prompt", prompt, question: q, hint: "POST prompt to your LLM provider; save result via PATCH /api/questions/:id/solution (admin)." });
  } catch (err) {
    if (err.name === "CastError") return res.status(400).json({ error: "Invalid question ID" });
    res.status(500).json({ error: err.message });
  }
};

// PATCH /api/questions/:id/solution { solutionText } — admin stores LLM/curated solution
exports.saveSolution = async (req, res) => {
  try {
    const q = await Question.findByIdAndUpdate(
      req.params.id,
      { solutionText: req.body.solutionText || "" },
      { new: true }
    ).select("title solutionText");
    if (!q) return res.status(404).json({ error: "Question not found" });
    res.json(q);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
