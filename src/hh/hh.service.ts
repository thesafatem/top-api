import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { HhData } from '../top-page/models/top-page.model';
import { API_URL, SALARY_CLUSTER_ID } from './hh.constants';
import { HhResponse } from './hh.models';

@Injectable()
export class HhService {
	constructor(private readonly httpService: HttpService) {}

	async getData(text: string) {
		try {
			const { data } = await lastValueFrom(
				this.httpService.get<HhResponse>(API_URL.vacancies, {
					params: {
						text,
						clusters: true,
					},
					headers: {
						'User-Agent': 'TopApi/1.0 (thesafatem@gmail.com)',
					},
				}),
			);
			return this.parseData(data);
		} catch (e) {
			Logger.error(e);
		}
	}

	private parseData(data: HhResponse): HhData {
		const salaryCluster = data.clusters.find((c) => {
			return c.id === SALARY_CLUSTER_ID;
		});

		if (!salaryCluster) {
			throw new Error(SALARY_CLUSTER_ID);
		}

		const juniorSalary = this.getSalaryFromString(
			salaryCluster.items[1].name,
		);
		const middleSalary = this.getSalaryFromString(
			salaryCluster.items[Math.ceil(salaryCluster.items.length / 2)]
				.name,
		);
		const seniorSalary = this.getSalaryFromString(
			salaryCluster.items[salaryCluster.items.length - 1].name,
		);

		return {
			count: data.found,
			juniorSalary,
			middleSalary,
			seniorSalary,
			updatedAt: new Date(),
		};
	}

	private getSalaryFromString(s: string): number {
		const numberRegExp = /(\d+)/g;
		const res = s.match(numberRegExp);
		if (!res) {
			return 0;
		}
		return Number(res[0]);
	}
}
