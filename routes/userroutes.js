import { Router } from "express";

const userroutes = Router();

userroutes.get("/", (req, res) => {res.send("all users")})

userroutes.delete("/:id", (req, res) => {res.send("delete user")});

userroutes.patch("/:id", (req, res) => {res.send("edit user")});

userroutes.post("/", (req, res) => {res.send("all users")});

export default userroutes;