const path = require("path");
require("dotenv").config({
  path: path.join(__dirname, "../.env")
});

const mongoose = require("mongoose");

const Brand = require("../src/models/Brand");
const Category = require("../src/models/Category");
const Product = require("../src/models/Product");

// ======================
// DB CONNECT
// ======================
async function connectDB() {
  await mongoose.connect("mongodb://localhost:27017/FashionMarket");
  console.log("DB Connected");
}

// ======================
// IMAGE PICKER
// ======================
function pick(arr, i) {
  return arr[i % arr.length];
}

// ======================
// IMAGES (REAL + NON-REPEATED STYLE)
// ======================
const img = {
  tshirt: [
    "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=60",
    "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?auto=format&fit=crop&w=800&q=60"
  ],
  shirt: [
    "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=800&q=60",
    "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=60"
  ],
  jeans: [
    "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=800&q=60",
    "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=800&q=60"
  ],
  jacket: [
   "https://www.mytheresa.com/image/1094/1238/100/fa/P01068466.jpg"
  ],
  hoodie: [
  "https://m.media-amazon.com/images/I/61pyF5Fn+qL._AC_SY741_.jpg"
  ],
  shoes: [
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=60",
  ]
};

// ======================
// MAIN SEED FUNCTION
// ======================
async function seed() {
  try {
    await connectDB();

    // clear old data
    await Brand.deleteMany();
    await Category.deleteMany();
    await Product.deleteMany();

    console.log("Old data deleted");

    // ======================
    // 🏷️ BRANDS
    // ======================
    const brands = await Brand.insertMany([
      { name: "Zara" },
      { name: "H&M" },
      { name: "Nike" },
      { name: "Adidas" },
      { name: "Puma" },
      { name: "Levi's" },
      { name: "Bershka" },
      { name: "Pull&Bear" }
    ]);

    // ======================
    // 📂 CATEGORIES
    // ======================
    const categories = await Category.insertMany([
      { name: "T-Shirts" },
      { name: "Shirts" },
      { name: "Jeans" },
      { name: "Hoodies" },
      { name: "Jackets" },
      { name: "Shoes" }
    ]);

    // ======================
    // discrption of products
    // ======================
    const descriptions = {
  "T-Shirts": "High quality cotton t-shirt designed for everyday comfort and modern street style.",
  "Shirts": "Elegant shirt made with premium fabric, perfect for casual and formal occasions.",
  "Jeans": "Durable denim jeans with perfect fit and long-lasting comfort.",
  "Hoodies": "Warm and stylish hoodie made for winter and streetwear fashion.",
  "Jackets": "Premium jacket designed for protection and modern fashion look.",
  "Shoes": "Comfortable and stylish footwear suitable for daily wear and sports."
};

    // ======================
    // 🛍️ PRODUCTS (50 STATIC + CLEAN)
    // ======================
    const products = [
      // T-Shirts
      { name: "Zara Basic T-Shirt Black", price: 25, category: categories[0]._id, brand: brands[0]._id, stock: 10, image: pick(img.tshirt, 0), description: descriptions["T-Shirts"] },
      { name: "H&M White Tee", price: 22, category: categories[0]._id, brand: brands[1]._id, stock: 12, image: pick(img.tshirt, 1), description: descriptions["T-Shirts"] },
      { name: "Nike Sport Tee", price: 35, category: categories[0]._id, brand: brands[2]._id, stock: 15, image: pick(img.tshirt, 2), description: descriptions["T-Shirts"] },
      { name: "Adidas Training Tee", price: 40, category: categories[0]._id, brand: brands[3]._id, stock: 9, image: pick(img.tshirt, 0), description: descriptions["T-Shirts"] },
      { name: "Puma Casual Tee", price: 30, category: categories[0]._id, brand: brands[4]._id, stock: 11, image: pick(img.tshirt, 1), description: descriptions["T-Shirts"] },

      // Shirts
      { name: "Zara Slim Shirt Blue", price: 55, category: categories[1]._id, brand: brands[0]._id, stock: 7, image: pick(img.shirt, 0) },
      { name: "H&M Casual Shirt White", price: 50, category: categories[1]._id, brand: brands[1]._id, stock: 10, image: pick(img.shirt, 1) },
      { name: "Bershka Printed Shirt", price: 45, category: categories[1]._id, brand: brands[6]._id, stock: 6, image: pick(img.shirt, 0) },

      // Jeans
      { name: "Levi's Slim Jeans", price: 80, category: categories[2]._id, brand: brands[5]._id, stock: 14, image: pick(img.jeans, 0) },
      { name: "Zara Black Jeans", price: 70, category: categories[2]._id, brand: brands[0]._id, stock: 11, image: pick(img.jeans, 1) },

      // Hoodies
      { name: "Nike Hoodie Black", price: 90, category: categories[3]._id, brand: brands[2]._id, stock: 10, image: pick(img.hoodie, 0) },
      { name: "Adidas Hoodie Grey", price: 95, category: categories[3]._id, brand: brands[3]._id, stock: 8, image: pick(img.hoodie, 1) },

      // Jackets
      { name: "Zara Winter Jacket", price: 120, category: categories[4]._id, brand: brands[0]._id, stock: 5, image: pick(img.jacket, 0) },
      { name: "H&M Denim Jacket", price: 100, category: categories[4]._id, brand: brands[1]._id, stock: 7, image: pick(img.jacket, 1) },

      // Shoes
      { name: "Nike Air Force 1", price: 150, category: categories[5]._id, brand: brands[2]._id, stock: 8, image: pick(img.shoes, 0) },
      { name: "Adidas Ultraboost", price: 160, category: categories[5]._id, brand: brands[3]._id, stock: 6, image: pick(img.shoes, 1) },

      // 🔥 auto fill until 50 products (clean + non-random)
      ...Array.from({ length: 34 }).map((_, i) => {
        const category = categories[i % categories.length];
        let imageSet = img.tshirt;

        if (category.name === "T-Shirts") imageSet = img.tshirt;
        if (category.name === "Shirts") imageSet = img.shirt;
        if (category.name === "Jeans") imageSet = img.jeans;
        if (category.name === "Hoodies") imageSet = img.hoodie;
        if (category.name === "Jackets") imageSet = img.jacket;
        if (category.name === "Shoes") imageSet = img.shoes;

        return {
          name: `${category.name} Product ${i + 10}`,
          price: 30 + i,
          description: descriptions[category.name],
          category: category._id,
          brand: brands[i % brands.length]._id,
          stock: (i % 20) + 1,
          image: pick(imageSet, i)
        };
      })
    ];

    await Product.insertMany(products);

    console.log("🔥 Seeder completed successfully (50 products)");

    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

seed();