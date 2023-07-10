import React from 'react'
import { Box, Loader, type BoxProps, type LoaderProps } from '@mantine/core'

type Props = {
  noLogo?: boolean
  sx?: BoxProps['sx']
  loaderProps?: LoaderProps
}

/**
 * This is a Overlay component, used to display a full width and height overlay with a spinner.
 *
 * @param props
 * @returns
 */

const Spinner = ({ noLogo, sx, loaderProps }: Props) => {
  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
        ...sx
      }}
    >
      <Loader size='lg' variant='bars' {...loaderProps} />
    </Box>
  )
}

export default Spinner
