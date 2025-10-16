import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import bcrypt from "bcryptjs";
import { signToken, authRequired } from "./auth/jwt.js";

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// Health
app.get('/api/health', (_req, res) => res.json({ ok: true, time: new Date().toISOString() }));

// Crops
app.get('/api/crops', async (_req, res) => {
  const rows = await prisma.crop.findMany({ orderBy: { name: 'asc' } });
  res.json(rows);
});

// Plots
app.get('/api/plots', async (req, res) => {
  const { status } = req.query; // active | deleted | undefined
  const where = status ? { status } : {};
  const rows = await prisma.plot.findMany({
    where,
    include: { crop: true, responsible: { select: { id: true, name: true, email: true } } },
    orderBy: { id: 'desc' },
  });
  res.json(rows);
});

app.get('/api/plots/deleted', async (_req, res) => {
  const rows = await prisma.plot.findMany({
    where: { status: 'deleted' },
    include: { crop: true, responsible: { select: { id: true, name: true, email: true } } },
    orderBy: { deletedAt: 'desc' },
  });
  res.json(rows);
});

app.get('/api/plots/:id', async (req, res) => {
  const id = Number(req.params.id);
  const row = await prisma.plot.findUnique({
    where: { id },
    include: { crop: true, responsible: { select: { id: true, name: true, email: true } } },
  });
  if (!row) return res.status(404).json({ message: 'Plot not found' });
  res.json(row);
});

app.post('/api/plots', async (req, res) => {
  const { name, lat, lng, areaHa, cropId, responsibleId } = req.body;
  if (!name || lat == null || lng == null) {
    return res.status(400).json({ message: 'name, lat, lng son obligatorios' });
  }
  const created = await prisma.plot.create({
    data: {
      name,
      lat,
      lng,
      areaHa: areaHa ?? 0,
      crop: cropId ? { connect: { id: Number(cropId) } } : undefined,
      responsible: responsibleId ? { connect: { id: Number(responsibleId) } } : undefined,
    },
  });
  res.status(201).json(created);
});

app.put('/api/plots/:id', async (req, res) => {
  const id = Number(req.params.id);
  const { name, lat, lng, areaHa, cropId, responsibleId, status } = req.body;

  const existing = await prisma.plot.findUnique({ where: { id } });
  if (!existing) return res.status(404).json({ message: 'Plot not found' });

  const data = {
    name: name ?? existing.name,
    lat: lat ?? existing.lat,
    lng: lng ?? existing.lng,
    areaHa: areaHa ?? existing.areaHa,
    status: status ?? existing.status,
    deletedAt: status === 'deleted' ? new Date() : null,
  };

  if (cropId !== undefined) {
    data['crop'] = cropId ? { connect: { id: Number(cropId) } } : { disconnect: true };
  }
  if (responsibleId !== undefined) {
    data['responsible'] = responsibleId ? { connect: { id: Number(responsibleId) } } : { disconnect: true };
  }

  const updated = await prisma.plot.update({
    where: { id },
    data,
    include: { crop: true, responsible: true },
  });
  res.json(updated);
});

app.delete('/api/plots/:id', async (req, res) => {
  const id = Number(req.params.id);
  const existing = await prisma.plot.findUnique({ where: { id } });
  if (!existing) return res.status(404).json({ message: 'Plot not found' });

  const deleted = await prisma.plot.update({
    where: { id },
    data: { status: 'deleted', deletedAt: new Date() },
  });
  res.json(deleted);
});

app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});

// ========= AUTH =========

// Registro
app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: "name, email y password son obligatorios" });

    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) return res.status(409).json({ message: "Email ya registrado" });

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { name, email, passwordHash },
      select: { id: true, name: true, email: true },
    });

    // (opcional) asignar rol "user"
    const roleUser = await prisma.role.findUnique({ where: { name: "user" } });
    if (roleUser) {
      await prisma.userRole.create({ data: { userId: user.id, roleId: roleUser.id } });
    }

    const token = signToken({ id: user.id, email: user.email, name: user.name });
    res.status(201).json({ user, token });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Error al registrar" });
  }
});

// Login
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "email y password son obligatorios" });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ message: "Credenciales inválidas" });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ message: "Credenciales inválidas" });

    const token = signToken({ id: user.id, email: user.email, name: user.name });
    res.json({ user: { id: user.id, name: user.name, email: user.email }, token });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Error al iniciar sesión" });
  }
});

// Perfil autenticado
app.get("/api/auth/me", authRequired, async (req, res) => {
  const me = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: { id: true, name: true, email: true },
  });
  res.json(me);
});
