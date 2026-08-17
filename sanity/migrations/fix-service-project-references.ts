import {getCliClient} from "sanity/cli";

const client = getCliClient({apiVersion: "2026-08-01"});

// Map old, renamed project IDs to their current canonical IDs.
const projectIdMap: Record<string, string | undefined> = {
  "room-to-breathe": "field-notes",
  "hands-of-stillness": "in-passing",
  "vows-in-bloom": "wedding-celebration",
};

const services = await client.fetch(`*[_type == "service"]{_id, projects}`);
let transaction = client.transaction();

for (const service of services) {
  if (!Array.isArray(service.projects)) continue;

  const hasBadRef = service.projects.some(
    (ref: {_ref?: string}) => ref._ref && projectIdMap[ref._ref],
  );
  if (!hasBadRef) continue;

  const fixedProjects = service.projects
    .map((ref: {_ref?: string; _type?: string; _key?: string}) => ({
      ...ref,
      _ref: (ref._ref && projectIdMap[ref._ref]) || ref._ref,
    }))
    .filter((ref: {_ref?: string}) => Boolean(ref._ref));

  transaction = transaction.patch(service._id, (p) =>
    p.set({projects: fixedProjects}),
  );
}

await transaction.commit();
console.log("Patched service references to point to valid project IDs.");
