const cron = require("node-cron");
const { Op } = require("sequelize");
const News = require("../models/News");

const expireOldNews = async () => {
  const now = new Date();
  const expiredDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  try {
    await News.update(
      { status: "unpublish" },
      {
        where: {
            category:"événements",
          status: "publish",
          date_start: {
            [Op.lte]: expiredDate,
          },
        },
      }
    );
    await News.update(
      { status: "unpublish" },
      {
        where: {
            category:"promotions",
          status: "publish",
          date_end: {
            [Op.lte]: expiredDate,
          },
        },
      }
    );
    console.log("✅ Expired news updated successfully.");
  } catch (err) {
    console.error("Error updating expired news:", err);
  }
};

cron.schedule("0 * * * *", expireOldNews);
