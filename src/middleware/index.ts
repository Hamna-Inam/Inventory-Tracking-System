import express from "express";
import rateLimit from "express-rate-limit";
import dotenv from 'dotenv';


dotenv.config();

export const basicAuth = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        res.status(401).json({ error: "Unauthorized: Missing Authorization Header" });
    }

    else if (!authHeader.startsWith("Basic ")) {
        res.status(401).json({ error: "Unauthorized: Missing Authorization Header" });
    }

    else {
        const base64Credentials = authHeader.split(" ")[1]; 
    const decodedCredentials = Buffer.from(base64Credentials, "base64").toString("utf8");
    const [username, password] = decodedCredentials.split(":"); 

    const validUsername = process.env.BASIC_AUTH_USERNAME;
    const validPassword = process.env.BASIC_AUTH_PASSWORD;

    if (username !== validUsername || password !== validPassword ) { 
        res.status(403).json({ error: "Forbidden: Invalid credentials" });
  }

  else {
    
    next();

  }
    }

     
};

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 1000, 
    message: { error: "Too many requests, please try again later." },
    headers: true, 
});

export default limiter;

