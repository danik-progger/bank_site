import renderService from "@/core/services/render.service";
import ChildComponent from "@/core/component/child.component";

import template from "./donout-chart.template.html";
import styles from "./donout-chart.module.scss";
import { $R } from "@/core/rquery/rquery.lib";

export class DonoutChart extends ChildComponent {
  gap = 15

  constructor(data, options = { size: 250, width: 50 }) {
    super()

    this.data = data
    this.size = options.size
    this.width = options.width
  }

  #calculateTotalValue() {
    return this.data.reduce((acc, slice) => acc + slice.value, 0)
  }

  #convertPolarToCartesian(percentage, radius) {
    const angleInDegrees = percentage * 3.6 - 90
    const angleInRadians = angleInDegrees * Math.PI / 180

    const x = radius * Math.cos(angleInRadians)
    const y = radius * Math.sin(angleInRadians)

    return [x, y]
  }

  #createSvgElement() {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')

    svg.setAttribute('width', this.size)
    svg.setAttribute('height', this.size)
    svg.setAttribute('viewBox', `-5 -5 ${this.size + this.gap} ${this.size + this.gap}`)

    return svg
  }

  #createSvgGroupElement() {
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g')

    g.setAttribute('transform',
      `translate(${this.size / 2 + this.gap / 4}, ${this.size / 2 + this.gap / 4})`
    )

    return g
  }

  #createPathElement(slice, pathData) {
    if (!pathData || pathData.includes('NaN'))
      return

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
    path.setAttribute('d', pathData)
    path.setAttribute('fill', 'none')
    path.setAttribute('stroke', slice.color)
    path.setAttribute('stroke-width', this.width)

    return path
  }

  #createPathElementsFromGroup(g) {
    const totalValue = this.#calculateTotalValue()
    const scale = 0.8
    const newSize = this.size * scale
    const radius = newSize / 2
    let accumulatedPercentage = 0

    this.data.forEach(slice => {
       const percentage = (slice.value  / totalValue) * 100
       const [startX, startY] = this.#convertPolarToCartesian(
          accumulatedPercentage, radius
       )

        accumulatedPercentage += percentage

       const [endX, endY] = this.#convertPolarToCartesian(
        accumulatedPercentage, radius
       )

       const largeArcFlag = percentage > 50 ? 1 : 0
       const pathData = `M ${startX} ${startY} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}`

       const path = this.#createPathElement(slice, pathData)
       path.classList.add('rotate')
       g.appendChild(path)  
    })
  }

  #getSvg() {
    const svgElement = this.#createSvgElement()
    const groupElement = this.#createSvgGroupElement()

    this.#createPathElementsFromGroup(groupElement)
    svgElement.appendChild(groupElement)

    return svgElement
  }

  render() {
    this.element = renderService.htmlToElement(template, [], styles)

    $R(this.element).append(this.#getSvg())

    return this.element
  }
}