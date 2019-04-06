export default interface UserData {
	id: number;
	username: string;
	login: string;
	email: string;
	imageUrl: string;
	type: UserType;
	name: string;
}

enum UserType {
	Org = 'Org',
	User = 'User',
}