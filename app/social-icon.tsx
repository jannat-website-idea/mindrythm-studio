export type SocialIconName = "instagram" | "facebook" | "youtube" | "x";

export function SocialIcon({ name }: { name: SocialIconName }) {
  if (name === "x") return null;
  return <img className={`social-icon-image social-icon-${name}`} src={`/social-icons/${name}.png`} alt="" aria-hidden="true" />;
}
