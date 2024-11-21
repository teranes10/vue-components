import Switch from "./Switch.vue";

export function useSwitchView(
  checked: boolean,
  onChanged?: (checked: boolean) => void,
  disabled?: boolean
) {
  disabled ??= !onChanged;
  return (
    <Switch
      modelValue={checked}
      color="success"
      disabled={disabled}
      onChanged={onChanged}
    />
  );
}
