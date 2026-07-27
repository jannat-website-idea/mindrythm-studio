import { Fragment } from "react";

const emphasisPattern = /(Mind Rythm Studio|Mind Rythm|rhythm|stories|story|emotions|emotion|ideas|idea|brands|brand|spaces|space)/gi;
const exactEmphasisPattern = /^(Mind Rythm Studio|Mind Rythm|rhythm|stories|story|emotions|emotion|ideas|idea|brands|brand|spaces|space)$/i;

export function EmphasizedCopy({ text }: { text: string }) {
  return (
    <>
      {text.split(emphasisPattern).map((part, index) => (
        <Fragment key={`${part}-${index}`}>
          {exactEmphasisPattern.test(part) ? <em className="editorial-emphasis">{part}</em> : part}
        </Fragment>
      ))}
    </>
  );
}
