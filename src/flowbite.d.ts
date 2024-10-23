declare module 'flowbite/plugin' {
  import { Config } from 'tailwindcss'
  const flowbitePlugin: Config['plugins'][number]
  export = flowbitePlugin
}
