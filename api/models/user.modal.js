import mongoose from "mongoose";
const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            trim: true,
            maxlength: 20,
        },
        email:{
            type: String,
            unique: true,
            required: true,
            lowercase: true,
            match: [/^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/, 'Use a valid email address'],
        },
        password: {
            type: String,
            required: true,
        },
        validId:{
            url: {
                type: String,
                default:''
            },
            filename : String
        },
        year: {
            type: Number,
            min: 1,
            max: 5,
        },
        department:{
            type: String,
            enum: ["ME", "EE ", "CE ", "CSE", "ECE"]
        },
        section:{
            type: String,
            enum: [ "A1", "A2", "B1", "B2" ],
        },
        isAdmin: {
            type: Boolean,
            default: false
        },
        isVerified: {
            type: Boolean,
            default: false
        },
        rollNo: {
            type: Number,
        }
    }, { timestamps: true });

const User = mongoose.model("User", userSchema);

export default User;
