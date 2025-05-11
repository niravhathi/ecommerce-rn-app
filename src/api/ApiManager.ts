// src/api/ApiManager.ts
import { APIConstant } from "./APIConstants";

class ApiManager {
  static baseUrl: string = "https://api.escuelajs.co/api/v1"; // Default base URL

  static init(baseUrl: string = APIConstant.BASE_URL) {
    this.baseUrl = baseUrl;
  }

  // Generic function to make GET requests
  static async get(endpoint: string, options: RequestInit = {}) {
    if (!this.baseUrl) {
      this.baseUrl = APIConstant.BASE_URL;
    }
    const url = `${this.baseUrl}${endpoint}`;
    console.log("Fetching URL:", url);
    try {
      const response = await fetch(url, {
        method: "GET",
        ...options, // merge headers or other config
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const jsonResponse = await response.text();
      const data = JSON.parse(jsonResponse);
      return data;
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  }

  // Generic function to make POST requests
  static async post(endpoint: string, body: object) {
    const url = `${this.baseUrl}${endpoint}`;
    console.log("Posting to URL:", url); // Log the URL being posted to
    try {
      const jsonBody = JSON.stringify(body); // Encode the body as a JSON string

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: jsonBody,
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const jsonResponse = await response.text(); // Get response as text

      // Decode the JSON string into an object
      const data = JSON.parse(jsonResponse);

      return data; // Return the parsed data
    } catch (error) {
      console.error("Error posting data:", error);
      throw error;
    }
  }
}

export default ApiManager;
