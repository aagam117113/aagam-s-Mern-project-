import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import { connectDB } from "./config/db.js";
import User from "./models/User.js";
import Post from "./models/Post.js";

dotenv.config();

const users = [
  { name: "Alice Johnson", email: "alice@example.com", password: "password123" },
  { name: "Bob Smith", email: "bob@example.com", password: "password123" },
  { name: "Charlie Davis", email: "charlie@example.com", password: "password123" },
];

const posts = [
  {
    title: "Getting Started with Node.js",
    content: "Node.js is a powerful JavaScript runtime built on Chrome's V8 engine. It allows developers to build scalable network applications using JavaScript on the server side. In this post, we'll explore the basics of Node.js and how to get started with building your first application.",
  },
  {
    title: "Understanding React Hooks",
    content: "React Hooks revolutionized the way we write React components. useState and useEffect are the most commonly used hooks that allow functional components to have state and side effects. This guide will walk you through practical examples of using hooks in your React applications.",
  },
  {
    title: "MongoDB Best Practices",
    content: "MongoDB is a NoSQL database that offers flexibility and scalability. However, to get the most out of it, you need to follow best practices like proper indexing, schema design, and query optimization. Learn how to structure your data for optimal performance.",
  },
  {
    title: "JWT Authentication Explained",
    content: "JSON Web Tokens (JWT) provide a stateless way to handle authentication in modern web applications. This post covers how JWTs work, their structure (header, payload, signature), and best practices for implementing secure authentication in your APIs.",
  },
  {
    title: "Building RESTful APIs with Express",
    content: "Express.js is the most popular Node.js framework for building web applications and APIs. Learn how to structure your routes, implement middleware, handle errors, and follow REST principles to create maintainable and scalable APIs.",
  },
  {
    title: "CSS Grid vs Flexbox",
    content: "Both CSS Grid and Flexbox are powerful layout tools, but they serve different purposes. Grid excels at two-dimensional layouts while Flexbox is perfect for one-dimensional layouts. Understand when to use each and how they can work together.",
  },
  {
    title: "Asynchronous JavaScript Patterns",
    content: "Mastering async/await, Promises, and callbacks is crucial for modern JavaScript development. This comprehensive guide covers different asynchronous patterns, error handling, and best practices for writing clean asynchronous code.",
  },
  {
    title: "State Management in React",
    content: "As your React application grows, managing state becomes more complex. Explore different state management solutions including Context API, Redux, and Zustand. Learn when to use local state vs global state and how to structure your application effectively.",
  },
  {
    title: "Docker for Beginners",
    content: "Docker has transformed the way we deploy applications. Learn the basics of containerization, how to create Dockerfiles, manage containers, and use Docker Compose for multi-container applications. Perfect for developers new to DevOps.",
  },
  {
    title: "Web Performance Optimization",
    content: "Website performance directly impacts user experience and SEO. Discover techniques for optimizing load times including code splitting, lazy loading, image optimization, caching strategies, and measuring performance with Lighthouse.",
  },
];

const seedDatabase = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany({});
    await Post.deleteMany({});
    console.log("Cleared existing data");

    // Create users
    const createdUsers = [];
    for (const userData of users) {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const user = await User.create({
        name: userData.name,
        email: userData.email,
        password: hashedPassword,
      });
      createdUsers.push(user);
      console.log(`Created user: ${user.name}`);
    }

    // Create posts with random authors
    for (const postData of posts) {
      const randomAuthor = createdUsers[Math.floor(Math.random() * createdUsers.length)];
      const post = await Post.create({
        title: postData.title,
        content: postData.content,
        author: randomAuthor._id,
      });
      console.log(`Created post: ${post.title} by ${randomAuthor.name}`);
    }

    console.log("\n✅ Database seeded successfully!");
    console.log("\nMock Users (all passwords: 'password123'):");
    createdUsers.forEach(user => {
      console.log(`  - ${user.email}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seedDatabase();
