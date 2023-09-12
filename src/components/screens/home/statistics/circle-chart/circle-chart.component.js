import renderService from "@/core/services/render.service";
import ChildComponent from "@/core/component/child.component";

import template from "./circle-chart.template.html";
import styles from "./circle-chart.module.scss";
import { DonoutChart } from "@/components/ui/donout-chart/donout-chart.component";

export class CircleChart extends ChildComponent {
  constructor(incomePercentage, expensePercentage) {
    super()
    this.incomePercentage = incomePercentage
    this.expensePercentage = expensePercentage
  }
  render() {
    this.element = renderService.htmlToElement(
      template, [
        new DonoutChart([
          { value: this.incomePercentage, color: '#08f0c8' },
          { value: this.expensePercentage, color: '#917cff' }
        ])
      ],
      styles)
    return this.element
  }
}
