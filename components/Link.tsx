import NextLink from 'next/link'
import type { AnchorHTMLAttributes, ComponentProps } from 'react'

type BaseProps = {
  href: string
  children: React.ReactNode
  className?: string
  external?: boolean
}

type LinkProps = BaseProps &
  (
    | Omit<ComponentProps<typeof NextLink>, keyof BaseProps>
    | Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof BaseProps>
  )

export default function Link({
  href,
  children,
  className = 'link',
  external = false,
  ...rest
}: LinkProps) {
  if (!external) {
    return (
      <NextLink href={href} className={className} {...rest}>
        {children}
      </NextLink>
    )
  }

  const anchorRest = { ...(rest as AnchorHTMLAttributes<HTMLAnchorElement>) }
  delete anchorRest.target
  delete anchorRest.rel
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      {...anchorRest}
    >
      {children}
    </a>
  )
}
