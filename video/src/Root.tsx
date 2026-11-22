import { Composition } from "remotion";
import { RpgVideo, TOTAL } from "./RpgVideo";

export const RemotionRoot: React.FC = () => (
  <Composition id="RpgVideo" component={RpgVideo} durationInFrames={TOTAL} fps={30} width={1920} height={1080} />
);
