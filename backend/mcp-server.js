import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

// Define the Property schema exactly as it is in the backend, or just connect and insert
const propertySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    location: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: [String], required: true },
    beds: { type: Number, required: true },
    baths: { type: Number, required: true },
    sqft: { type: Number, required: true },
    type: { type: String, required: true },
    availability: { type: String, required: true },
    description: { type: String, required: true },
    amenities: { type: Array, required: true },
    phone: { type: String, required: true },
    googleMapLink: { type: String, default: "" },
    status: { type: String, default: "active" },
    postedBy: { type: mongoose.Schema.Types.ObjectId, default: null },
    rejectionReason: { type: String, default: "" },
    expiresAt: { type: Date, default: null },
  },
  { timestamps: true }
);

const Property = mongoose.model("Property", propertySchema);

// Connect to MongoDB
const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return;
  try {
    await mongoose.connect(process.env.MONGO_URI);
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
};

// Create the MCP server
const server = new Server(
  {
    name: "Lqaly-MCP-Server",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Define tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "create_property",
        description: "Creates a new real estate property listing in the Lqaly database.",
        inputSchema: {
          type: "object",
          properties: {
            title: { type: "string", description: "Title of the property" },
            location: { type: "string", description: "Location/City of the property" },
            price: { type: "number", description: "Price in MAD" },
            image: { 
              type: "array", 
              items: { type: "string" }, 
              description: "Array of image URLs (provide at least one, usually 4)" 
            },
            beds: { type: "number", description: "Number of bedrooms" },
            baths: { type: "number", description: "Number of bathrooms" },
            sqft: { type: "number", description: "Size in square feet or square meters" },
            type: { type: "string", description: "Property type (e.g., 'Villa', 'Appartement')" },
            availability: { type: "string", description: "Availability (e.g., 'À vendre', 'À louer')" },
            description: { type: "string", description: "Detailed description of the property" },
            amenities: { 
              type: "array", 
              items: { type: "string" }, 
              description: "Array of amenities (e.g., ['Piscine', 'Jardin'])" 
            },
            phone: { type: "string", description: "Contact phone number" },
            googleMapLink: { type: "string", description: "Google Maps link (optional)" },
          },
          required: [
            "title", "location", "price", "image", "beds", "baths", "sqft", 
            "type", "availability", "description", "amenities", "phone"
          ],
        },
      },
    ],
  };
});

// Handle tool execution
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === "create_property") {
    try {
      await connectDB();
      const propertyData = request.params.arguments;
      
      const newProperty = new Property({
        ...propertyData,
        status: "active", // Created by MCP (admin level) are active by default
      });
      
      await newProperty.save();
      
      return {
        content: [
          {
            type: "text",
            text: `Property successfully created with ID: ${newProperty._id}`,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Failed to create property: ${error.message}`,
          },
        ],
        isError: true,
      };
    }
  }

  throw new Error(`Tool not found: ${request.params.name}`);
});

// Start the server with Stdio transport
async function run() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Lqaly MCP Server running on stdio");
}

run().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
