import React from 'react'
import type { ComponentType, SVGProps } from 'react'

interface IconProps {
  icon: ComponentType<SVGProps<SVGSVGElement>>
  className?: string
  'aria-hidden'?: boolean
}

export default function Icon({ icon: IconComponent, ...props }: IconProps) {
  return <IconComponent {...props} />
} 