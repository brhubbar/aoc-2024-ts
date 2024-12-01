export function debug(message: any) {
  if (process.env.IS_TEST == undefined) {
    return;
  }
  console.log(message);
}
