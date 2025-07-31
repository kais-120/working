const authenticateToken = require("../middleware/authMiddleware");
const Feedback = require("../models/Feedback");

exports.createFeedback = [
  authenticateToken,
  async (req, res) => {
    try {
      const { message, rating } = req.body;
      const userId = req.userId;

      if (!message || !rating) {
        return res.status(400).json({
          success: false,
          message: "Message et note sont requis",
        });
      }

      if (rating < 1 || rating > 5) {
        return res.status(400).json({
          success: false,
          message: "La note doit être entre 1 et 5",
        });
      }

      const feedback = new Feedback({
        user: userId,
        message,
        rating,
      });

      await feedback.save();

      res.status(201).json({
        success: true,
        message: "Feedback créé avec succès",
        data: feedback,
      });
    } catch (error) {
      console.error("Erreur lors de la création du feedback:", error);
      res.status(500).json({
        success: false,
        message: "Erreur serveur",
      });
    }
  },
];

exports.getFeedbacks = async (req, res) => {
  try {
    const { status = "approved" } = req.query;

    const feedbacks = await Feedback.find({ status })
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .limit(20);

    res.json({
      success: true,
      data: feedbacks,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des feedbacks:", error);
    res.status(500).json({
      success: false,
      message: "Erreur serveur",
    });
  }
};

exports.updateFeedbackStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["pending", "approved", "rejected"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Statut invalide",
      });
    }

    const feedback = await Feedback.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: "Feedback non trouvé",
      });
    }

    res.json({
      success: true,
      message: "Statut mis à jour",
      data: feedback,
    });
  } catch (error) {
    console.error("Erreur lors de la mise à jour du feedback:", error);
    res.status(500).json({
      success: false,
      message: "Erreur serveur",
    });
  }
};
