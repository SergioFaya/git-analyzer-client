import UserData from './UserData';

export default interface ICodeReview {
	title?: string,
	created_at?: Date,
	created_by?: UserData,
	commentary?: string,
	//	userEvaluations?: Array<IUserEvaluation>
	calification?: number,
}

/*
export interface IUserEvaluation {
	user: UserData,
	calification: number,
}
*/