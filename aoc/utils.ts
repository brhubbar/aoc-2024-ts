export function debug(message: string) {
  if (process.env.IS_TEST == undefined) {
    return;
  }
  console.log(message);
}
