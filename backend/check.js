import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./src/models/Product.model.js";

dotenv.config();

async function run() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    
    // Check how many bestsellers currently exist
    const currentBestSellers = await Product.countDocuments({ bestSeller: true });
    console.log(`Currently there are ${currentBestSellers} bestsellers in the database.`);

    if (currentBestSellers === 0) {
      console.log("Setting 4 products to be bestsellers...");
      // Let's set 4 random products to be bestSellers so they show up
      const products = await Product.find().limit(4);
      for (const p of products) {
        await Product.updateOne({ _id: p._id }, { $set: { bestSeller: true } });
        console.log("Set bestSeller=true for:", p.name);
      }
    }
    
    console.log("Done");
  } catch (e) {
    console.error(e);
  } finally {
    process.exit(0);
  }
}

run();
