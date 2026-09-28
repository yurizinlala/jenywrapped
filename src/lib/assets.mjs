export function publicAsset(
  src,
  basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "",
) {
  const prefix = basePath.replace(/\/$/, "");
  if (
    !src ||
    !src.startsWith("/") ||
    src.startsWith("//") ||
    !prefix ||
    src === prefix ||
    src.startsWith(prefix + "/")
  )
    return src;
  return prefix + src;
}
