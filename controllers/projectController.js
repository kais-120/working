const authenticateToken = require('../middleware/authMiddleware');
const Project = require('../models/Project');

// GET all projects
exports.getAllProjects = [authenticateToken , async (req, res) => {
  try {
     const userId = req.userId;
      const projects = await Project.find({ userId }).sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}
]

// CREATE a new project
exports.createProject = [ authenticateToken , async (req, res) => {
  try {
    const { name, description, deadline } = req.body;
    const project = new Project({ name, description, deadline, userId:req.userId });
    await project.save();
    res.status(201).json(project);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}
]

// DELETE a project
exports.deleteProject = [authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    await Project.findByIdAndDelete(id);
    res.json({ message: "Project deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}
]

// ADD a document
exports.addDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, type, size } = req.body;
    const project = await Project.findById(id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    project.documents.push({ name, type, size });
    await project.save();
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
