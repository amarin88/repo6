import { Router } from "express";
import userDao from "../dao/mongoDao/user.dao.js";

const router = Router();

// Ruta para crear una nueva session
router.post("/register", async (req, res) => {
  try {
    const userData = req.body; //Datos de usuario que vamos a recibir por el body
    const newUser = await userDao.create(userData); //Agrega el nuevo usuario a la base de datos

    if (!newUser)
      return res.status(400).json({
        status: 400,// Devuelve el código de estado del error 400
        response: "Cannot Create User",// Devuelve el mensaje de error
      });
    res.status(201).json({ status: "success", payload: newUser }); // Responde con el usuario creado y el código de estado 201 (creado)
  } catch (error) {
    console.log(error); // Registra cualquier error en la consola
    return res.status(500).json({
      status: error.status || 500, // Devuelve el código de estado del error o 500 si no está definido
      response: error.message || "ERROR", // Devuelve el mensaje de error o "ERROR" si no está definido
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body; //Datos de login que vamos a recibir para verificar usuario

    if (email === "admincoder@coder.com" && password === "coderpass123") {
      req.session.user = {
        email,
        role: "admin",
      };
      return res
        .status(200)
        .json({ status: "success", payload: req.session.user });
    } //Verificamos que los datos ingresados coincidan con los del admin, en caso que si retornamos afirmativamente

    const user = await userDao.getByEmail(email);
    if (!user || user.password !== password) {
      return res.status(401).json({
        status: 401,// Devuelve el código de estado del error 401
        response: "Invalid email or password",// Devuelve el mensaje de error
      })
    }
    
    req.session.user = {
      email,
      role: "user",
    };//Verificamos que los datos ingresados coincidan con los de un usuario válido, en caso que si retornamos afirmativamente

    return res.status(200).json({ status: "success", payload: req.session.user });
  } catch (error) {
    console.log(error); // Registra cualquier error en la consola
    return res.status(500).json({
      status: error.status || 500, // Devuelve el código de estado del error o 500 si no está definido
      response: error.message || "ERROR", // Devuelve el mensaje de error o "ERROR" si no está definido
    });
  }
});

router.get("/logout", async (req, res) => {
  try {
    req.session.destroy();

    res.status(200).json({ status: "success", response: "Session completed successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: 500, response: "Internal Server Error" });
  }
});//Endpoint para finalizar la sesión 

export default router;
