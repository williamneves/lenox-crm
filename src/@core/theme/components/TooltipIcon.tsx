import { Tooltip, ActionIcon, TooltipProps, ActionIconProps } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

type TooltipIconProps = {
  children: TooltipProps['children']
  color: ActionIconProps['color']
  variant?: ActionIconProps['variant']
  onClick?: () => void | Promise<void>
  withArrow?: TooltipProps['withArrow']
  position?: TooltipProps['position']
  label: TooltipProps['label']
  tooltipProps?: Partial<TooltipProps>
  actionIconProps?: Partial<ActionIconProps>
}

const TooltipIcon = ({
  children,
  color,
  label,
  variant = 'transparent',
  withArrow = true,
  position = 'left',
  tooltipProps,
  actionIconProps,
  onClick
}: TooltipIconProps) => {

  return (
    <Tooltip
      label={label}
      withArrow={withArrow}
      position={position}
      {...tooltipProps}
    >
      <ActionIcon
        onClick={onClick}
        color={color}
        variant={variant}
        {...actionIconProps}
      >
        {children}
      </ActionIcon>
    </Tooltip>
  )
}

export default TooltipIcon