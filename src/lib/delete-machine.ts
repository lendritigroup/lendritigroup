import { prisma } from "./prisma";
import { DEMO_SLUGS } from "./demo-listings";

export { DEMO_SLUGS };

export async function deleteMachineById(id: string) {
  await prisma.inquiry.updateMany({
    where: { machineId: id },
    data: { machineId: null },
  });
  await prisma.document.deleteMany({ where: { machineId: id } });
  await prisma.photo.deleteMany({ where: { machineId: id } });
  await prisma.machine.delete({ where: { id } });
}

export async function deleteMachinesByIds(ids: string[]) {
  for (const id of ids) {
    await deleteMachineById(id);
  }
  return ids.length;
}

export async function deleteDemoMachines() {
  const machines = await prisma.machine.findMany({
    where: {
      OR: [
        { slug: { in: DEMO_SLUGS } },
        { stockNumber: { startsWith: "LG-" } },
      ],
    },
    select: { id: true },
  });
  const ids = machines.map((m) => m.id);
  await deleteMachinesByIds(ids);
  return ids.length;
}
