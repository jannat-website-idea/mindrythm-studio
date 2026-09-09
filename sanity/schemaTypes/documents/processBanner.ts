import {defineField, defineType} from "sanity";

export const processBanner = defineType({
  name: "processBanner",
  title: "Process section banner ('From first conversation to final frame')",
  type: "document",
  fields: [
    defineField({
      name: "mediaType",
      title: "Media Type",
      description: "Select whether you want to display an Image or Video for the process banner.",
      type: "string",
      options: {
        list: [
          {title: "Image (Photograph)", value: "image"},
          {title: "Video (Film / Motion)", value: "video"},
        ],
        layout: "radio",
      },
      initialValue: "image",
    }),
    defineField({
      name: "image",
      title: "Banner Image Upload",
      description: "Upload a high-resolution photograph for the process banner. Supports JPG, PNG, and WebP.",
      type: "image",
      options: {hotspot: true},
    }),
    defineField({
      name: "video",
      title: "Banner Video Upload",
      description: "Upload an MP4, WebM, or MOV video file. The video will autoplay, loop, and be muted seamlessly.",
      type: "file",
      options: {accept: "video/mp4,video/webm,video/quicktime"},
    }),
    defineField({
      name: "externalUrl",
      title: "External Media URL (Optional)",
      description: "Paste a direct link to an image or video file if hosted on a CDN or cloud storage.",
      type: "string",
    }),
    defineField({
      name: "overlayBadge",
      title: "Overlay Badge Text",
      description: "The small category pill shown on bottom-left of the banner.",
      type: "string",
      initialValue: "Brief / Plan / Capture",
    }),
    defineField({
      name: "overlayText",
      title: "Overlay Caption Text",
      description: "The narrative statement displayed over the banner.",
      type: "string",
      initialValue: "A calm production gives spaces, people and real emotion room to lead.",
    }),
    defineField({
      name: "ctaLabel",
      title: "CTA Button Text",
      description: "The clickable bold link inside the banner overlay.",
      type: "string",
      initialValue: "View our work",
    }),
    defineField({
      name: "linkUrl",
      title: "Banner Destination Link",
      description: "The page this banner navigates to when clicked.",
      type: "string",
      initialValue: "/work",
    }),
  ],
  preview: {
    select: {
      mediaType: "mediaType",
      image: "image",
    },
    prepare({mediaType, image}) {
      return {
        title: "Process Section Banner",
        subtitle: `From first conversation to final frame (${mediaType === "video" ? "Video" : "Image"})`,
        media: image,
      };
    },
  },
});
