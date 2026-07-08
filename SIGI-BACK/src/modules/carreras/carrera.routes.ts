import { Router } from "express";
import { carreraController } from "./controller/carrera.controller.js";
import { validateJwt } from "../../core/middlewares/validate-jwt.middleware.js";
import { validateRole } from "../../core/middlewares/validate-role.middleware.js";
import { Role } from "../../core/enums/role.enum.js";
import {dossierMiddleware} from "../../core/middlewares/upload.middleware.js";

export const carreraRouter = Router();

carreraRouter.get("/publicas", carreraController.getAllPublicas);
carreraRouter.get("/publicas/:id", carreraController.getByIdPublica);
carreraRouter.get("/publicas/:id/landing", carreraController.getLandingPublica);
carreraRouter.get("/", validateJwt, carreraController.getAll);
carreraRouter.get("/:id", validateJwt, carreraController.getById);
carreraRouter.post("/", validateJwt, validateRole(Role.ADMIN), carreraController.create);
carreraRouter.patch("/:id", validateJwt, validateRole(Role.ADMIN), carreraController.update);
carreraRouter.delete("/:id", validateJwt, validateRole(Role.ADMIN), carreraController.delete);
carreraRouter.patch("/:id/dossier", validateJwt, validateRole(Role.ADMIN), dossierMiddleware.single("dossier"), carreraController.uploadDossier);