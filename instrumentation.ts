export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    process.setMaxListeners(30);
  }
}
