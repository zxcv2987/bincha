import { prisma } from "@/prisma/prismaClient";
import { serializeBigInt } from "@/utils/serialize/serializeBigInt";
import { revalidateTag } from "next/cache";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  try {
    const category = await prisma.category.delete({
      where: {
        id: Number(id),
      },
    });
    revalidateTag("/");
    return Response.json(serializeBigInt(category));
  } catch (error) {
    console.log(error);
    return Response.error();
  }
}
