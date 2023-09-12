import renderService from "@/core/services/render.service";
import ChildComponent from "@/core/component/child.component";

import template from "./statistics.template.html";
import styles from "./statistics.module.scss";
import { Store } from "@/core/store/store";
import { StatisticService } from "@/api/statistic.service";
import { TRANSACTION_COMPLETED } from "@/constants/event.constants";
import { LOADER_SELECTOR, Loader } from "@/components/ui/loader/loader.component";
import { $R } from "@/core/rquery/rquery.lib";
import { StatisticItem } from "./statistic-item/statistic-item.component";
import { formatToCurrency } from "@/utils/format/format-to-currency";
import { Heading } from "@/components/ui/heading/heading.component";
import { CircleChart } from "./circle-chart/circle-chart.component";

export class Statistics extends ChildComponent {
  constructor() {
    super()

    this.storeState = Store.getInstance().state
    this.statisticService = new StatisticService()
    this.element = renderService.htmlToElement(
      template,
      [new Heading('Statistics')],
      styles)

    this.#addListeners()
  }

  #addListeners() {
		document.addEventListener(
      TRANSACTION_COMPLETED,
      this.#onTransactionCompleted
    )
	}

	#removeListeners() {
		document.removeEventListener(
      TRANSACTION_COMPLETED,
      this.#onTransactionCompleted
    )
	}

	#onTransactionCompleted = () => {
		this.fetchData()
	}

	destroy() {
		this.#removeListeners()
	}

  renderCircleChart(income, expense) {
    const total = income + expense
    let incomePercent = (income / total) * 100
    let expensePercent = (expense / total) * 100

    if (income && !expense) {
      incomePercent = 100
      expensePercent = 0.1
    }
    if (!income && expense) {
      incomePercent = 0.1
      expensePercent = 100
    }

    return new CircleChart(incomePercent, expensePercent).render()
  }

  fetchData() {
    this.statisticService.main(data => {
      if (!data)
        return

      const loaderElement = this.element.querySelector(LOADER_SELECTOR)
      if (loaderElement)
        loaderElement.remove()

      const statisticsItemElement = $R(this.element).find('#statistic-items')
      statisticsItemElement.text('')

      const circleChartElement = $R(this.element).find('#circle-chart')
      circleChartElement.text('')

      statisticsItemElement
        .append(
          new StatisticItem(
            'Income:',
            formatToCurrency(data[0].value),
            'green'
          ).render()
        )
        .append(
          new StatisticItem(
            'Expenses:',
            formatToCurrency(data[1].value),
            'purple'
          ).render()
        )

        circleChartElement.append(
          this.renderCircleChart(data[0].value, data[1].value)
        )
    })
  }

  render() {
    if (this.storeState.user) {
      $R(this.element).append(new Loader().render())
			setTimeout(() => this.fetchData(), 500)
    }

    return this.element
  }
}