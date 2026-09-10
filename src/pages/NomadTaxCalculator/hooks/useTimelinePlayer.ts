import { useCallback, useEffect, useRef, useState } from "react";
import { IDLE_FRAME, type FiberFrame } from "../../ReactFiber/scenarios";

export function useTimelinePlayer() {
  const ids = useRef<ReturnType<typeof setTimeout>[]>([]);
  const [frame, setFrame] = useState<FiberFrame>(IDLE_FRAME);
  const [narrationIdx, setNarrationIdx] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playCount, setPlayCount] = useState(0);

  const cancel = useCallback(() => {
    ids.current.forEach(clearTimeout);
    ids.current = [];
  }, []);

  const play = useCallback(
    (timeline: FiberFrame[], stepMs = 500) => {
      cancel();
      setIsPlaying(true);
      setPlayCount((c) => c + 1);
      setFrame(timeline[0]);
      setNarrationIdx(0);
      let elapsed = stepMs;
      timeline.slice(1).forEach((f, raw) => {
        const i = raw + 1;
        const id = setTimeout(() => {
          setFrame(f);
          setNarrationIdx(i);
          if (i === timeline.length - 1) setIsPlaying(false);
        }, elapsed);
        ids.current.push(id);
        elapsed += stepMs;
      });
    },
    [cancel]
  );

  const reset = useCallback(() => {
    cancel();
    setIsPlaying(false);
    setFrame(IDLE_FRAME);
    setNarrationIdx(null);
  }, [cancel]);

  useEffect(() => cancel, [cancel]);

  return { frame, narrationIdx, isPlaying, playCount, play, reset };
}
