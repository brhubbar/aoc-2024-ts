export function debug(message: any) {
  if (process.env.DEBUG == undefined) {
    return;
  }
  console.log(message);
}
