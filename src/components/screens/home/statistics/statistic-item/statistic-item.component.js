import renderService from "@/core/services/render.service";
import { $R } from "@/core/rquery/rquery.lib";
import ChildComponent from "@/core/component/child.component";

import template from "./statistic-item.template.html";
import styles from "./statistic-item.module.scss";

export class StatisticItem extends ChildComponent {
  /**
   * @param {string} label 
   * @param {number} value 
   * @param {('green' | 'purple')} color 
   */
  constructor(label, value, color) {
    super()

    if (!label || !value || !color)
      throw new Error('All arguments required')

    this.label = label
    this.value = value
    this.color = color
  }

  render() {
    this.element = renderService.htmlToElement(template, [], styles)

    $R(this.element).addClass(styles[this.color]).addClass('fade-in')
    $R(this.element).find('#label').text(this.label)
    $R(this.element).find('#value').text(this.value)

    return this.element
  }
}