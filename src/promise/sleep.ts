export default async function sleep(delay: number) {
  return new Promise((res, _) => {
    setTimeout(res, Math.max(delay, 0));
  });
}