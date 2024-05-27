import type { UserSettings, UserData, DataSource } from "./index.js";

export interface LoadContext {
	userSettings: UserSettings;
	userData: UserData;
	userDataForUserDataCleaner: UserData;
	dataSource: DataSource;
	dataSourceAlias?: string;
	multiDataSource: boolean;
	originalDomain?: string;
}