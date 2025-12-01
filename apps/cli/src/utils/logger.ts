export function logHeader(command: string): void {
  console.log(`rift · ${command}`);
}

export function logInfo(message: string): void {
  console.log(message);
}

export function logError(message: string): void {
  console.error(`ERROR: ${message}`);
}
