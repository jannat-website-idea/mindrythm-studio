import {getCliClient} from "sanity/cli";

type SanityDocument = {
  _id: string;
  _type: string;
  _rev?: string;
  _createdAt?: string;
  _updatedAt?: string;
  [key: string]: unknown;
};

type Reference = {_type: "reference"; _ref: string; [key: string]: unknown};

const client = getCliClient({apiVersion: "2026-08-01"});
const collectionTypes = ["project", "service", "teamMember", "testimonial", "galleryItem"];
const documents = await client.fetch<SanityDocument[]>(
  `*[_type in $types]`,
  {types: collectionTypes},
);

const legacyDocuments = documents.filter((document) => document._id.includes("."));
if (!legacyDocuments.length) {
  console.log("No private dotted collection document IDs remain.");
  process.exit(0);
}

const replacementIds = new Map(legacyDocuments.map((document) => [document._id, publicId(document)]));
const hero = await client.fetch<SanityDocument | null>(`*[_id == "heroSection"][0]`);
let transaction = client.transaction();

for (const document of legacyDocuments) {
  const {_rev, _createdAt, _updatedAt, ...portableDocument} = document;
  void _rev;
  void _createdAt;
  void _updatedAt;
  const rewrittenDocument = rewriteReferences(portableDocument, replacementIds) as Record<string, unknown>;
  transaction = transaction.createOrReplace({
    ...rewrittenDocument,
    _id: replacementIds.get(document._id)!,
    _type: document._type,
  });
}

if (hero?.featuredProjects) {
  transaction = transaction.patch(hero._id, {
    set: {featuredProjects: rewriteReferences(hero.featuredProjects, replacementIds)},
  });
}

for (const document of legacyDocuments) transaction = transaction.delete(document._id);
await transaction.commit();

console.log(`Migrated ${legacyDocuments.length} collection documents to public IDs without changing their content.`);

function publicId(document: SanityDocument) {
  const suffix = document._id.slice(document._id.indexOf(".") + 1).replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "").toLowerCase();
  const prefix = document._type === "teamMember" ? "team-member" : document._type === "galleryItem" ? "gallery-item" : document._type;
  return `${prefix}-${suffix}`;
}

function rewriteReferences(value: unknown, replacements: Map<string, string>): unknown {
  if (Array.isArray(value)) return value.map((item) => rewriteReferences(item, replacements));
  if (!value || typeof value !== "object") return value;

  const record = value as Record<string, unknown>;
  if (record._type === "reference" && typeof record._ref === "string") {
    const replacement = replacements.get(record._ref);
    return replacement ? {...record, _ref: replacement} as Reference : record;
  }

  return Object.fromEntries(Object.entries(record).map(([key, item]) => [key, rewriteReferences(item, replacements)]));
}
