const { db } = require("@vercel/postgres");
const { questions } = require("../app/lib/placeholder-data.ts");
const bcrypt = require("bcrypt");
