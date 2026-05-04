const mongoose = require('mongoose');

const colorSchema = new mongoose.Schema({
  color: { type: String, required: true },
  quantity: { type: Number, default: 0 }
}, { _id: false });

const sizeSchema = new mongoose.Schema({
  size: { type: String, required: true },
  colors: [colorSchema]
}, { _id: false });

const imageSchema = new mongoose.Schema({
  image_url: { type: String, required: true },
  firstimg: { type: Boolean, default: false }
}, { _id: false });

const productSchema = new mongoose.Schema({  
  category: { type: String },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description1: { type: String },
  description2: { type: String },
  description3: { type: String },
  collection_name: { type: String }, // 'collection' is a reserved word in mongoose schema sometimes, let's just use collection_name or collection. We can use collection field, but to be safe let's name the property collection_name, wait, the db uses `collection`, mongoose allows it if it's not the options. Let's just use `product_collection` or keep it `collection` but Mongoose often lets you use `collection` as a Path name if you don't mess with Schema options. Let's use `collection_name` to be 100% safe but map it if needed. Let's stick to `collectionType`. Wait, `collection` works fine in Mongoose as a standard field.
  collection_name: { type: String }, // I'll map frontend `collection` to `collection_name` just in case, but let's see. Wait, in SQL it's `collection`. I'll use `product_collection`. Let me just use `collectionType` and adapt it in the controller/service. Actually `collection: { type: String }` works fine in Mongoose. Let's just use it but add a comment.
  product_collection: { type: String }, // renamed from collection to avoid mongoose schema option collision
  material: { type: String },
  technique: { type: String },
  packaging: { type: String },
  is_featured: { type: Boolean, default: false },
  pro_code: { type: String },
  images: [imageSchema],
  colors: [{ type: String }],
  sizes: [sizeSchema]
}, { timestamps: { createdAt: 'created_at', updatedAt: false } });

// Create a virtual for backwards compatibility with frontends expecting "collection"
productSchema.virtual('collection').get(function() { return this.product_collection; });
productSchema.virtual('collection').set(function(val) { this.product_collection = val; });
productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Product', productSchema);
