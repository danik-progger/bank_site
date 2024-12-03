import { redQuery } from '@/core/my-query/my-query.lib'

export class StatisticService {
	#BASE_URL = '/statistics'

	main(onSuccess) {
		return redQuery({
			path: this.#BASE_URL,
			onSuccess
		})
	}
}
