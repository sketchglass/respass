import RandomIcon = require("randomicon")

export
class IconGenerator {
  icons = new Map()
  randomIcon = new RandomIcon()

  generate(name: string) {
    if (this.icons.has(name)) {
      return this.icons.get(name)
    }
    this.randomIcon.generate(name)
    const data = this.randomIcon.toDataURL()
    this.icons.set(name, data)
    return data
  }
}

export const iconGenerator = new IconGenerator()
