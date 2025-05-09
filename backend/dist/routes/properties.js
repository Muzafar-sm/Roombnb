"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Property_1 = __importDefault(require("../models/Property"));
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.get("/", async (req, res) => {
    try {
        console.log("Fetching properties...");
        const { city, country, minPrice, maxPrice, guests, bedrooms, bathrooms, } = req.query;
        const query = {};
        if (city)
            query["location.city"] = city;
        if (country)
            query["location.country"] = country;
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice)
                query.price.$gte = Number(minPrice);
            if (maxPrice)
                query.price.$lte = Number(maxPrice);
        }
        if (guests)
            query.maxGuests = { $gte: Number(guests) };
        if (bedrooms)
            query.bedrooms = { $gte: Number(bedrooms) };
        if (bathrooms)
            query.bathrooms = { $gte: Number(bathrooms) };
        console.log("Query:", query);
        const properties = await Property_1.default.find(query)
            .populate("host", "firstName lastName email")
            .sort({ createdAt: -1 });
        console.log("Found properties:", properties.length);
        res.json(properties);
    }
    catch (error) {
        console.error("Error fetching properties:", error);
        res.status(500).json({ error: "Server error" });
    }
});
router.get("/:id", async (req, res) => {
    try {
        const property = await Property_1.default.findById(req.params.id).populate("host", "firstName lastName email");
        if (!property) {
            return res.status(404).json({ error: "Property not found" });
        }
        res.json(property);
    }
    catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});
router.post("/", auth_1.auth, (0, auth_1.checkRole)(["host", "admin"]), async (req, res) => {
    try {
        const property = new Property_1.default({
            ...req.body,
            host: req.user._id,
        });
        await property.save();
        res.status(201).json(property);
    }
    catch (error) {
        res.status(400).json({ error: "Invalid property data" });
    }
});
router.put("/:id", auth_1.auth, async (req, res) => {
    try {
        const property = await Property_1.default.findById(req.params.id);
        if (!property) {
            return res.status(404).json({ error: "Property not found" });
        }
        if (property.host.toString() !== req.user._id.toString() &&
            req.user.role !== "admin") {
            return res.status(403).json({ error: "Not authorized" });
        }
        const updatedProperty = await Property_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedProperty);
    }
    catch (error) {
        res.status(400).json({ error: "Invalid property data" });
    }
});
router.delete("/:id", auth_1.auth, async (req, res) => {
    try {
        const property = await Property_1.default.findById(req.params.id);
        if (!property) {
            return res.status(404).json({ error: "Property not found" });
        }
        if (property.host.toString() !== req.user._id.toString() &&
            req.user.role !== "admin") {
            return res.status(403).json({ error: "Not authorized" });
        }
        await property.deleteOne();
        res.json({ message: "Property deleted" });
    }
    catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});
exports.default = router;
//# sourceMappingURL=properties.js.map