import mongoose from "mongoose"; //Importamos mongoose

const userCollection = "user"; //Nombre de la colección

const userSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: String,
    password: {
        type: String,
        index: true
    },
    age: Number,
}); //Esquema del usuario, array de objetos que va a mostrar el usuario con su objectId


export const userModel = mongoose.model(userCollection, userSchema);