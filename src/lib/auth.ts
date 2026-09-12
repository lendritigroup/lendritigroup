import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";

const COOKIE = "lg_admin";
const TTL = 60 * 60 * 24 * 7;

function secret() {
  const value = process.env.AUTH_SECRET || "lendriti-dev-secret-change-me";
  return new TextEncoder().encode(value);
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export async function createSession(userId: string, email: string) {
  const token = await new SignJWT({ sub: userId, email })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${TTL}s`)
    .sign(secret());

  const jar = await cookies();
  jar.set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: TTL,
  });
}

export async function destroySession() {
  const jar = await cookies();
  jar.delete(COOKIE);
}

export async function getSession() {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret());
    if (!payload.sub || typeof payload.email !== "string") return null;
    return { userId: payload.sub, email: payload.email };
  } catch {
    return null;
  }
}

export async function requireAdmin() {
  const session = await getSession();
  if (!session) return null;
  const user = await prisma.adminUser.findUnique({ where: { id: session.userId } });
  if (!user) return null;
  return { id: user.id, email: user.email, name: user.name };
}

export async function loginAdmin(username: string, password: string) {
  const login = username.trim();
  const user = await prisma.adminUser.findFirst({
    where: {
      OR: [{ email: login }, { name: login }],
    },
  });
  if (!user) return { error: "Invalid username or password" };
  const ok = await verifyPassword(password, user.passwordHash);
  if (!ok) return { error: "Invalid username or password" };
  await createSession(user.id, user.email);
  return { user: { id: user.id, email: user.email } };
}
