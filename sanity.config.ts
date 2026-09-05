import {visionTool} from "@sanity/vision";
import {defineConfig} from "sanity";
import {presentationTool} from "sanity/presentation";
import {structureTool} from "sanity/structure";
import {schemaTypes} from "./sanity/schemaTypes";
import {presentationResolve} from "./sanity/presentation";
import {mindrythmStructure} from "./sanity/structure";

const previewUrl = process.env.SANITY_STUDIO_PREVIEW_URL || "https://mindrythm.com";

export default defineConfig({
  name: "mindrythm",
  title: "Mindrythm CMS",
  projectId: "n9nyugiq",
  dataset: "production",
  plugins: [
    structureTool({structure: mindrythmStructure}),
    presentationTool({
      resolve: presentationResolve,
      previewUrl: {
        origin: previewUrl,
        previewMode: {enable: "/api/draft-mode/enable"},
      },
    }),
    visionTool({defaultApiVersion: "2026-08-01"}),
  ],
  schema: {types: schemaTypes},
});
