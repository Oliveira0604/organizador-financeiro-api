import type { GetPercentageByCategoryIdUseCase } from "@/use-cases/income/get-percentage-by-category-id-use-case";

export class GetPercentageByCategoryIdController implements Controller {
    constructor(
        private getPercentageByCategoryIdUseCase: GetPercentageByCategoryIdUseCase
    ) { }

}