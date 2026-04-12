const SUCCESS_MESSAGES = [
  "شاطر!",
  "ممتاز!",
  "كمّل كده!",
  "يا سلام!",
  "برافو!",
  "إبداع!",
  "ما شاء الله!",
  "قوي!",
  "تحفة!",
  "كده صح!",
  "أحسنت جداً!",
  "ناجح ومتميز!",
] as const;

const RETRY_MESSAGES = [
  "لا بأس!",
  "جرّب تاني!",
  "ما زالت الفرصة قدامك!",
  "ركّز أكتر!",
  "كل خطوة بتعلّمك!",
  "ما تيأسش — جرّب من تاني!",
] as const;

function pick<T extends readonly string[]>(arr: T): T[number] {
  return arr[Math.floor(Math.random() * arr.length)]!;
}

export function randomSuccessPraise(): string {
  return pick(SUCCESS_MESSAGES);
}

export function randomRetryPraise(): string {
  return pick(RETRY_MESSAGES);
}
