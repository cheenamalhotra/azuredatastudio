/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the Source EULA. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { createDecorator } from 'vs/platform/instantiation/common/instantiation';
import { IStringDictionary } from 'vs/base/common/collections';
import { Event } from 'vs/base/common/event';
import { IExtensionRecommendation } from 'sql/workbench/services/extensionManagement/common/extensionManagement'; // {{SQL CARBON EDIT}} Custom extension recommendation

export const enum ExtensionRecommendationReason {
	Workspace,
	File,
	Executable,
	WorkspaceConfig,
	DynamicWorkspace,
	Experimental,
	Application,
}

export interface IExtensionRecommendationReason {
	reasonId: ExtensionRecommendationReason;
	reasonText: string;
}

export const IExtensionRecommendationsService = createDecorator<IExtensionRecommendationsService>('extensionRecommendationsService');

export interface IExtensionRecommendationsService {
	readonly _serviceBrand: undefined;

	readonly onDidChangeRecommendations: Event<void>;
	getAllRecommendationsWithReason(): IStringDictionary<IExtensionRecommendationReason>;

	getImportantRecommendations(): Promise<string[]>;
	getOtherRecommendations(): Promise<string[]>;
	getFileBasedRecommendations(): string[];
	getExeBasedRecommendations(exe?: string): Promise<{ important: string[]; others: string[] }>;
	getConfigBasedRecommendations(): Promise<{ important: string[]; others: string[] }>;
	getWorkspaceRecommendations(): Promise<string[]>;
	getKeymapRecommendations(): string[];

	getRecommendedExtensionsByScenario(scenarioType: string): Promise<IExtensionRecommendation[]>; // {{SQL CARBON EDIT}}
	promptRecommendedExtensionsByScenario(scenarioType: string): void; // {{SQL CARBON EDIT}}
	getLanguageRecommendations(): string[];
	getRemoteRecommendations(): string[];
}

export type IgnoredRecommendationChangeNotification = {
	extensionId: string;
	isRecommended: boolean;
};

export const IExtensionIgnoredRecommendationsService = createDecorator<IExtensionIgnoredRecommendationsService>('IExtensionIgnoredRecommendationsService');

export interface IExtensionIgnoredRecommendationsService {
	readonly _serviceBrand: undefined;

	onDidChangeIgnoredRecommendations: Event<void>;
	readonly ignoredRecommendations: string[];

	onDidChangeGlobalIgnoredRecommendation: Event<IgnoredRecommendationChangeNotification>;
	readonly globalIgnoredRecommendations: string[];
	toggleGlobalIgnoredRecommendation(extensionId: string, ignore: boolean): void;
}


