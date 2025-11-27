export function checkYesNo(messageRaw) {
  const msg = messageRaw.trim().toLowerCase();

  const yes = ["sim", "s", "ss", "claro", "isso", "uhum", "aham", "pode ser"];
  const no = ["não", "nao", "n", "nem", "nop", "negativo", "nao.", "não."];

  if (yes.includes(msg)) return "affirmation";
  if (no.includes(msg)) return "negation";

  return null;
}
