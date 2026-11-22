import React from "react";
import { Audio, Sequence, staticFile } from "remotion";
import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { Compendium, Dice, Intro, Outro, Roles, Sheet, Wizard } from "./scenes";

const T = 15;
const scenes: [React.FC, number][] = [
  [Intro, 190],
  [Sheet, 215],
  [Wizard, 210],
  [Compendium, 165],
  [Dice, 135],
  [Roles, 175],
  [Outro, 150],
];

// início de cada cena (frames) + pequeno atraso para a fala entrar depois da transição
const starts = scenes.map((_, i) =>
  scenes.slice(0, i).reduce((a, [, d]) => a + d - T, 0),
);
const VO_STARTS = starts.map((s, i) => s + (i === 0 ? 8 : i === 4 ? 0 : 12));

export const TOTAL =
  scenes.reduce((a, [, d]) => a + d, 0) - T * (scenes.length - 1);

export const RpgVideo: React.FC = () => (
  <>
    <Audio src={staticFile("music.wav")} volume={0.3} />
    {VO_STARTS.map((from, i) => (
      <Sequence key={i} from={from} layout="none">
        <Audio src={staticFile(`vo/v${i + 1}.wav`)} volume={1} />
      </Sequence>
    ))}
    <TransitionSeries>
      {scenes.flatMap(([S, d], i) => {
        const els = [
          <TransitionSeries.Sequence key={`s${i}`} durationInFrames={d}>
            <S />
          </TransitionSeries.Sequence>,
        ];
        if (i < scenes.length - 1) {
          els.push(
            <TransitionSeries.Transition
              key={`t${i}`}
              presentation={i % 2 ? slide({ direction: "from-right" }) : fade()}
              timing={linearTiming({ durationInFrames: T })}
            />,
          );
        }
        return els;
      })}
    </TransitionSeries>
  </>
);
