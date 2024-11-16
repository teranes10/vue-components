import ProgressBar from "./ProgressBar.vue";

export interface useProgressBarViewOptions {
  label?: string;
  height?: number;
  color?: string;
}

export function useProgressBarView(
  percentage: number,
  { label = undefined, height = 12, color }: useProgressBarViewOptions = {}
) {
  return () => (
    <ProgressBar
      percentage={percentage}
      label={label}
      height={height}
      color={color}
    />
  );
}
