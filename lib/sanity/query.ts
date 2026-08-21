export const siteContentQuery = `{
  "siteSettings": *[_type == "siteSettings" && _id == "siteSettings"][0],
  "hero": *[_type == "heroSection" && _id == "heroSection"][0]{
    titleLineOne,
    titleLineTwo,
    visionHighlights,
    "featuredProjectIds": featuredProjects[]->cmsId.current
  },
  "about": *[_type == "aboutContent" && _id == "aboutContent"][0],
  "contact": *[_type == "contactInfo" && _id == "contactInfo"][0],
  "social": *[_type == "socialLinks" && _id == "socialLinks"][0],
  "footer": *[_type == "footerSettings" && _id == "footerSettings"][0],
  "seo": *[_type == "seoSettings" && _id == "seoSettings"][0]{
    title,
    description,
    "shareImageUrl": coalesce(shareImage.asset->url, shareImageFallback)
  },
  "privacyPolicy": *[_type == "privacyPolicy" && _id == "privacyPolicy"][0]{eyebrow, title, sections[]{heading, body}},
  "termsConditions": *[_type == "termsConditions" && _id == "termsConditions"][0]{eyebrow, title, sections[]{heading, body}},
  "services": *[_type == "service"] | order(sortOrder asc){
    key,
    title,
    copy,
    "projectIds": projects[]->cmsId.current
  },
  "projects": *[_type == "project"] | order(sortOrder asc, _createdAt asc){
    "id": cmsId.current,
    sortOrder,
    title,
    eyebrow,
    body,
    "mediaUrl": coalesce(media.image.asset->url, media.video.asset->url, media.externalUrl),
    "mediaAlt": media.alt,
    category,
    year,
    href,
    accent
  },
  "gallery": *[_type == "galleryItem"] | order(sortOrder asc, _createdAt asc){
    "id": cmsId.current,
    sortOrder,
    title,
    body,
    "mediaUrl": coalesce(media.image.asset->url, media.video.asset->url, media.externalUrl),
    "mediaAlt": media.alt,
    category,
    mediaType,
    "layoutType": coalesce(lower(layoutType), "large"),
    href
  },
  "team": *[_type == "teamMember"] | order(sortOrder asc, _createdAt asc){
    "id": coalesce(cmsId.current, _id),
    sortOrder,
    title,
    "eyebrow": role,
    "body": bio,
    "mediaUrl": coalesce(media.image.asset->url, media.video.asset->url, media.externalUrl),
    "mediaAlt": coalesce(media.alt, title),
    "category": role,
    "href": coalesce(profileUrl, instagram, instagramUrl, socialUrl, href)
  },
  "testimonials": *[_type == "testimonial"] | order(sortOrder asc){
    "id": _id,
    sortOrder,
    "title": title,
    "eyebrow": clientType,
    "body": quote,
    "category": clientType,
    "year": string(rating),
    "href": reviewUrl,
    "accent": select(theme == "dark" => "ink", "approved")
  }
}`;
