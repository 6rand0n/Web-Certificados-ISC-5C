const express = require("express");
    const cors = require("cors");
    const app = express();

    app.use(cors());
    app.use(express.json());

    // conecta las rutas
    const questionsRoutes = require("./routes/questions.routes");
    const certificationsRoutes = require("./routes/certifications.routes"); 
    const userRoutes = require("./routes/users.routes");

    app.use("/api/questions", questionsRoutes);
    app.use("/api/certifications", certificationsRoutes); 
    app.use("/api", userRoutes);
    
    // Arrancar el servidor
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
            console.log(`Servidor escuchando en http://localhost:${PORT}`);
    });