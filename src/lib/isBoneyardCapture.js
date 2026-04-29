export function isBoneyardCapture() {
  return (
    typeof window !== "undefined" &&
    window.__BONEYARD_BUILD === true
  );
}
