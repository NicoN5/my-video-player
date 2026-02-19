import { Subtitle } from "@/types/Subtitle";

export function generateSubtitles(subtitles: Subtitle[]) {
  const lines = [
    "\tsubtitles: [",
    ...subtitles.map((s) => [
      "\t\t{",
      `\t\t\tstartSeconds: ${s.startSeconds},`,
      `\t\t\tendSeconds: ${s.endSeconds},`,
      `\t\t\ttext: "${s.text}",`,
      `\t\t},`,
    ]),
    "\t]",
  ];

  return lines.flat().join("\n");
}
