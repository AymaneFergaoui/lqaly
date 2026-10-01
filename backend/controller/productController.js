import fs from "fs";
import imagekit from "../config/imagekit.js";
import Property from "../models/propertyModel.js";

const addproperty = async (req, res) => {
    try {
        const { title, location, price, beds, baths, sqft, type, availability, description, amenities, phone, googleMapLink } = req.body;

        const image1 = req.files.image1 && req.files.image1[0];
        const image2 = req.files.image2 && req.files.image2[0];
        const image3 = req.files.image3 && req.files.image3[0];
        const image4 = req.files.image4 && req.files.image4[0];

        const images = [image1, image2, image3, image4].filter((item) => item !== undefined);

        // Upload images to ImageKit
        const imageUrls = await Promise.all(
            images.map(async (item) => {
                const result = await imagekit.upload({
                    file: item.buffer,
                    fileName: item.originalname,
                    folder: "Property",
                });
                return result.url;
            })
        );

        // Create a new product
        const product = new Property({
            title,
            location,
            price,
            beds,
            baths,
            sqft,
            type,
            availability,
            description,
            amenities,
            image: imageUrls,
            phone,
            googleMapLink: googleMapLink || ''
        });

        // Save the product to the database
        await product.save();

        res.json({ message: "Product added successfully", success: true });
    } catch (error) {
        console.log("Error adding product: ", error);
        res.status(500).json({ message: "Server Error", success: false });
    }
};

const listproperty = async (req, res) => {
    try {
        // Pagination parameters
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20; // Default 20 per page
        const skip = (page - 1) * limit;

        // Only return active properties publicly.
        // Legacy admin-added documents that pre-date the status field are also
        // included via the $exists check so they are not accidentally hidden.
        const query = {
            $or: [{ status: 'active' }, { status: { $exists: false } }],
        };

        // Get total count for pagination metadata
        const totalProperties = await Property.countDocuments(query);
        const totalPages = Math.ceil(totalProperties / limit);

        // Get properties with pagination
        const property = await Property.find(query)
            .sort({ createdAt: -1 }) // Most recent first
            .limit(limit)
            .skip(skip);

        res.json({
            property,
            success: true,
            pagination: {
                currentPage: page,
                totalPages,
                totalProperties,
                hasNextPage: page < totalPages,
                hasPreviousPage: page > 1,
                limit
            }
        });
    } catch (error) {
        console.log("Error listing products: ", error);
        res.status(500).json({ message: "Server Error", success: false });
    }
};

const removeproperty = async (req, res) => {
    try {
        const property = await Property.findByIdAndDelete(req.body.id);
        if (!property) {
            return res.status(404).json({ message: "Property not found", success: false });
        }
        return res.json({ message: "Property removed successfully", success: true });
    } catch (error) {
        console.log("Error removing product: ", error);
        return res.status(500).json({ message: "Server Error", success: false });
    }
};

const updateproperty = async (req, res) => {
    try {
        const { id, title, location, price, beds, baths, sqft, type, availability, description, amenities, phone, googleMapLink } = req.body;

        const property = await Property.findById(id);
        if (!property) {
            console.log("Property not found with ID:", id); // Debugging line
            return res.status(404).json({ message: "Property not found", success: false });
        }

        if (!req.files || Object.keys(req.files).length === 0) {
            // No new images provided
            property.title = title;
            property.location = location;
            property.price = price;
            property.beds = beds;
            property.baths = baths;
            property.sqft = sqft;
            property.type = type;
            property.availability = availability;
            property.description = description;
            property.amenities = amenities;
            property.phone = phone;
            property.googleMapLink = googleMapLink || '';
            
            // Keep existing images or remove if cleared
            if (req.body.existingImages) {
                property.image = Array.isArray(req.body.existingImages) ? req.body.existingImages : [req.body.existingImages];
            } else {
                property.image = []; // user removed all images
            }
            
            await property.save();
            return res.json({ message: "Property updated successfully", success: true });
        }

        const image1 = req.files.image1 && req.files.image1[0];
        const image2 = req.files.image2 && req.files.image2[0];
        const image3 = req.files.image3 && req.files.image3[0];
        const image4 = req.files.image4 && req.files.image4[0];

        const images = [image1, image2, image3, image4].filter((item) => item !== undefined);

        // Upload images to ImageKit
        const imageUrls = await Promise.all(
            images.map(async (item) => {
                const result = await imagekit.upload({
                    file: item.buffer,
                    fileName: item.originalname,
                    folder: "Property",
                });
                return result.url;
            })
        );

        let finalImages = [];
        if (req.body.existingImages) {
            finalImages = Array.isArray(req.body.existingImages) ? req.body.existingImages : [req.body.existingImages];
        }
        finalImages = finalImages.concat(imageUrls);

        property.title = title;
        property.location = location;
        property.price = price;
        property.beds = beds;
        property.baths = baths;
        property.sqft = sqft;
        property.type = type;
        property.availability = availability;
        property.description = description;
        property.amenities = amenities;
        property.image = finalImages;
        property.phone = phone;
        property.googleMapLink = googleMapLink || '';

        await property.save();
        res.json({ message: "Property updated successfully", success: true });
    } catch (error) {
        console.log("Error updating product: ", error);
        res.status(500).json({ message: "Server Error", success: false });
    }
};

const singleproperty = async (req, res) => {
    try {
        const { id } = req.params;
        const property = await Property.findById(id);
        if (!property) {
            return res.status(404).json({ message: "Property not found", success: false });
        }
        // Block public access to listings that are not yet approved or have been
        // rejected/expired. Legacy docs without a status field are always visible.
        if (property.status && property.status !== 'active') {
            return res.status(404).json({ message: "Property not found", success: false });
        }
        res.json({ property, success: true });
    } catch (error) {
        console.log("Error fetching property:", error);
        res.status(500).json({ message: "Server Error", success: false });
    }
};

const addPropertyAi = async (req, res) => {
    try {
        const { prompt } = req.body;
        if (!prompt) {
            return res.status(400).json({ success: false, message: "Prompt is required" });
        }

        const systemMessage = `
You are a real estate AI assistant for Lqaly.
Extract the property details from the user's prompt and return exactly in this JSON format (NO extra text, NO markdown, JUST raw JSON):
{
  "title": "String",
  "location": "String",
  "price": Number (in MAD),
  "image": ["String (URL)"],
  "beds": Number,
  "baths": Number,
  "sqft": Number,
  "type": "String",
  "availability": "String",
  "description": "String",
  "amenities": ["String"],
  "phone": "String",
  "googleMapLink": "String"
}
Default phone to "0600000000" if missing. Default image to ["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800"] if missing. Default type to "Appartement" if missing. Default availability to "À vendre".
`;

        const { default: axios } = await import("axios");
        const response = await axios.post(
            `${process.env.CLAUDE_BASE_URL}/chat/completions`,
            {
                model: "claude-sonnet-4.6", // Using the permitted model from LiteLLM proxy
                messages: [
                    { role: "system", content: systemMessage },
                    { role: "user", content: prompt }
                ]
            },
            {
                headers: {
                    "Authorization": `Bearer ${process.env.CLAUDE_API_KEY}`,
                    "Content-Type": "application/json"
                }
            }
        );

        let aiText = response.data.choices[0].message.content;
        
        // Remove markdown formatting if any
        if (aiText.startsWith("```json")) {
            aiText = aiText.replace(/^```json\n/, "").replace(/\n```$/, "");
        } else if (aiText.startsWith("```")) {
            aiText = aiText.replace(/^```\n/, "").replace(/\n```$/, "");
        }

        const propertyData = JSON.parse(aiText);

        const newProperty = new Property({
            ...propertyData,
            status: "active"
        });

        await newProperty.save();

        res.json({ success: true, message: "Property created by AI", property: newProperty });
    } catch (error) {
         console.error("AI Creation Error:", error.response?.data || error.message);
         res.status(500).json({ success: false, message: "Failed to create property via AI", error: error.message });
    }
};

export { addproperty, listproperty, removeproperty, updateproperty , singleproperty, addPropertyAi};