import { prisma } from "@/prisma/prismaClient";
import { serializeBigInt } from "@/utils/serialize/serializeBigInt";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const category = await prisma.category.findMany();
    return NextResponse.json(serializeBigInt(category));
  } catch (error) {
    console.log(error);
    return NextResponse.error();
  }
}

export async function POST(request: Request) {
  try {
    const { category_name } = await request.json();
    const category = await prisma.category.create({
      data: {
        category_name,
      },
    });
    return NextResponse.json(serializeBigInt(category));
  } catch (error) {
    return NextResponse.error();
  }
}
