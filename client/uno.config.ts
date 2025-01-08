import { defineConfig, presetAttributify, presetUno } from 'unocss'

export default defineConfig({
  presets: [presetUno(), presetAttributify()],
  shortcuts: {
    "emphasis": "font-bold text-3xl m-x-2",
    "section": "h-screen flex flex-col gap-2 p-y-12 p-x-4"
  }
})
