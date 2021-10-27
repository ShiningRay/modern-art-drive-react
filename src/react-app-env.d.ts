/* eslint-disable */
/// <reference types="react" />
/// <reference types="react-dom" />

declare namespace NodeJS {
  interface ProcessEnv {
    readonly NODE_ENV: 'development' | 'production' | 'test'
    readonly PUBLIC_URL: string
  }
}

declare module '*.avif' {
  const src: string
  export default src
}

declare module '*.bmp' {
  const src: string
}

declare module '*.gif' {
  const src: string
}

declare module '*.jpg' {
  const src: string
  export = src;
}

declare module '*.jpeg' {
  const src: string
  export = src;
}

declare module '*.svg' {
  const src: string
  export = src;
}

declare module '*.png' {
  const value: string;
  export = value;
}

declare module '*.mp4' {
  const value: string;
  export = value;
}

declare module '*.webp' {
  const src: string
}

declare module '*.glb' {
  const src: string
  export = src;
}

// declare module '*.svg' {
//   import * as React from 'react'

//   export const ReactComponent: React.FunctionComponent<
//   React.SVGProps<SVGSVGElement> & { title?: string }
//   >

//   const src: string
// }

declare module '*.module.css' {
  const classes: { readonly [key: string]: string }
}

declare module '*.module.scss' {
  const classes: { readonly [key: string]: string }
}

declare module '*.module.sass' {
  const classes: { readonly [key: string]: string }
}

declare function ThemeAnimation({ opacity, speed, width, length, segments, dir, ...props }: {
  [x: string]: any;
  opacity?: number | undefined;
  speed?: number | undefined;
  width?: number | undefined;
  length?: number | undefined;
  segments?: number | undefined;
  dir?: number | undefined;
}): JSX.Element;

