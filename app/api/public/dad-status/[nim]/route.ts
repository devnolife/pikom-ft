import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * Public lookup: GET /api/public/dad-status/{nim}
 *
 * Returns whether a student (by NIM) has completed
 * "Darul Arqam Dasar (DAD)" according to their `Progress` records
 * in this PIKOM-FT system.
 *
 * Used by external integrations (e.g. `simtekmu`) to auto-verify the
 * `dad_certificate` KKP requirement — mirrors the pattern used by
 * TajwidKu for the Qur'an-reading certificate.
 *
 * Response shape:
 *   { valid: true,  dad: { title, status, completedAt } }
 *   { valid: false, message: string }
 *
 * Only the minimum data needed to confirm completion is exposed
 * (no password, no email, no internal IDs).
 */
const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Accept",
} as const;

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ nim: string }> }
) {
  const { nim } = await params;
  const trimmed = (nim || "").trim();

  if (!trimmed) {
    return NextResponse.json(
      { valid: false, message: "NIM wajib diisi" },
      { status: 400, headers: CORS_HEADERS }
    );
  }

  try {
    const user = await prisma.user.findUnique({
      where: { nim: trimmed },
      select: { id: true, nim: true, name: true },
    });

    if (!user) {
      return NextResponse.json(
        { valid: false, message: "Mahasiswa tidak terdaftar di PIKOM-FT" },
        { status: 404, headers: CORS_HEADERS }
      );
    }

    // Find a "Darul Arqam Dasar" / "DAD" progress entry with status `selesai`.
    // Matching is loose so titles like "DAD Angkatan 1" or
    // "Darul Arqam Dasar (DAD)" all qualify.
    const progressRows = await prisma.progress.findMany({
      where: {
        userId: user.id,
        status: "selesai",
        OR: [
          { title: { contains: "DAD", mode: "insensitive" } },
          { title: { contains: "Darul Arqam", mode: "insensitive" } },
        ],
      },
      orderBy: { updatedAt: "desc" },
      take: 1,
      select: { title: true, status: true, updatedAt: true, note: true },
    });

    const dad = progressRows[0];
    if (!dad) {
      return NextResponse.json(
        {
          valid: false,
          message: "Belum ada catatan DAD selesai untuk NIM ini",
          student: { nim: user.nim, name: user.name },
        },
        { status: 404, headers: CORS_HEADERS }
      );
    }

    return NextResponse.json(
      {
        valid: true,
        student: { nim: user.nim, name: user.name },
        dad: {
          title: dad.title,
          status: dad.status,
          completedAt: dad.updatedAt,
          note: dad.note,
        },
      },
      { headers: CORS_HEADERS }
    );
  } catch (e: any) {
    return NextResponse.json(
      { valid: false, message: e.message },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}
