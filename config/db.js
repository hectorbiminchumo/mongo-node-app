const mongoose = require("mongoose");

const connectDB = async () => {
    
        mongoose.connect(process.env.MONGO_URI)
          .then(() => console.log("🔥 MongoDB Connected"))
          .catch(err => {
            console.error("❌ MongoDB Connection Error:", err.message);
            process.exit(1);
          });
        

}

module.exports = connectDB