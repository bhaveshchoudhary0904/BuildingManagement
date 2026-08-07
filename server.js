require("dotenv").config({ path: "./backend/.env" });

const app = require("./backend/src/app");

// Listen only when not in Vercel environment
if (process.env.NODE_ENV !== "production" || !process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}

module.exports = app;
