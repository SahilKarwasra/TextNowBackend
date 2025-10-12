import { config } from "dotenv";
import { connectDB } from "../lib/db.js";
import User from "../models/user.model.js";

config();

const seedUsers = [
  {
    email: "luna.martinez@example.com",
    fullName: "Luna Martinez",
    password: "123456",
    profilePic: "https://randomuser.me/api/portraits/women/11.jpg",
  },
  {
    email: "zoe.hall@example.com",
    fullName: "Zoe Hall",
    password: "123456",
    profilePic: "https://randomuser.me/api/portraits/women/12.jpg",
  },
  {
    email: "ella.white@example.com",
    fullName: "Ella White",
    password: "123456",
    profilePic: "https://images.unsplash.com/photo-1502767089025-6572583495b4",
  },
  {
    email: "grace.lopez@example.com",
    fullName: "Grace Lopez",
    password: "123456",
    profilePic: "https://randomuser.me/api/portraits/women/14.jpg",
  },
  {
    email: "nora.king@example.com",
    fullName: "Nora King",
    password: "123456",
    profilePic: "https://images.unsplash.com/photo-1517841905240-472988babdf9",
  },
  {
    email: "hazel.scott@example.com",
    fullName: "Hazel Scott",
    password: "123456",
    profilePic: "https://randomuser.me/api/portraits/women/16.jpg",
  },
  {
    email: "violet.adams@example.com",
    fullName: "Violet Adams",
    password: "123456",
    profilePic: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e",
  },
  {
    email: "mia.collins@example.com",
    fullName: "Mia Collins",
    password: "123456",
    profilePic: "https://randomuser.me/api/portraits/women/18.jpg",
  },
  {
    email: "ethan.baker@example.com",
    fullName: "Ethan Baker",
    password: "123456",
    profilePic: "https://randomuser.me/api/portraits/men/11.jpg",
  },
  {
    email: "liam.turner@example.com",
    fullName: "Liam Turner",
    password: "123456",
    profilePic: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde",
  },
  {
    email: "jack.hughes@example.com",
    fullName: "Jack Hughes",
    password: "123456",
    profilePic: "https://randomuser.me/api/portraits/men/12.jpg",
  },
  {
    email: "logan.green@example.com",
    fullName: "Logan Green",
    password: "123456",
    profilePic: "https://images.unsplash.com/photo-1527980965255-d3b416303d12",
  },
  {
    email: "sebastian.foster@example.com",
    fullName: "Sebastian Foster",
    password: "123456",
    profilePic: "https://randomuser.me/api/portraits/men/14.jpg",
  },
  {
    email: "mason.ward@example.com",
    fullName: "Mason Ward",
    password: "123456",
    profilePic: "https://images.unsplash.com/photo-1544005313-94ddf0286df2",
  },
  {
    email: "noah.carter@example.com",
    fullName: "Noah Carter",
    password: "123456",
    profilePic: "https://randomuser.me/api/portraits/men/16.jpg",
  },
];

const seedDatabase = async () => {
  try {
    await connectDB();
    await User.insertMany(seedUsers);
    console.log("✅ Database seeded successfully with updated users");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
  }
};

seedDatabase();
