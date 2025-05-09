import express from "express";
import Property from "../models/Property";
import { auth, checkRole } from "../middleware/auth";

const router = express.Router();

// Get all properties with filters
router.get("/", async (req, res) => {
  try {
    console.log("Fetching properties...");
    const {
      city,
      country,
      minPrice,
      maxPrice,
      guests,
      bedrooms,
      bathrooms,
    } = req.query;

    const query: any = {};

    if (city) query["location.city"] = city;
    if (country) query["location.country"] = country;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    if (guests) query.maxGuests = { $gte: Number(guests) };
    if (bedrooms) query.bedrooms = { $gte: Number(bedrooms) };
    if (bathrooms) query.bathrooms = { $gte: Number(bathrooms) };

    console.log("Query:", query);
    const properties = await Property.find(query)
      .populate("host", "firstName lastName email")
      .sort({ createdAt: -1 });
    
    console.log("Found properties:", properties.length);
    res.json(properties);
  } catch (error) {
    console.error("Error fetching properties:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Get single property
router.get("/:id", async (req, res) => {
  try {
    const property = await Property.findById(req.params.id).populate(
      "host",
      "firstName lastName email"
    );

    if (!property) {
      return res.status(404).json({ error: "Property not found" });
    }

    res.json(property);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Create property
// Create property
router.post("/", auth, checkRole(["host", "admin"]), async (req, res) => {
  try {
    const property = new Property({
      ...req.body,
      host: req.user._id,
    });

    await property.save();
    res.status(201).json(property);
  } catch (error) {
    res.status(400).json({ error: "Invalid property data" });
  }
});

// Update property
router.put("/:id", auth, async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ error: "Property not found" });
    }

    // Check if user is the host or admin
    if (
      property.host.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ error: "Not authorized" });
    }

    const updatedProperty = await Property.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updatedProperty);
  } catch (error) {
    res.status(400).json({ error: "Invalid property data" });
  }
});

// Delete property
router.delete("/:id", auth, async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ error: "Property not found" });
    }

    // Check if user is the host or admin
    if (
      property.host.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ error: "Not authorized" });
    }

    await property.deleteOne();
    res.json({ message: "Property deleted" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

export default router;