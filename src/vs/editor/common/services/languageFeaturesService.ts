/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the Source EULA. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { URI } from 'vs/base/common/uri';
import { LanguageFeatureRegistry, NotebookInfo, NotebookInfoResolver } from 'vs/editor/common/languageFeatureRegistry';
import { CodeActionProvider, CodeLensProvider, CompletionItemProvider, DocumentPasteEditProvider, DeclarationProvider, DefinitionProvider, DocumentColorProvider, DocumentFormattingEditProvider, DocumentHighlightProvider, DocumentOnDropEditProvider, DocumentRangeFormattingEditProvider, DocumentRangeSemanticTokensProvider, DocumentSemanticTokensProvider, DocumentSymbolProvider, EvaluatableExpressionProvider, FoldingRangeProvider, HoverProvider, ImplementationProvider, InlayHintsProvider, InlineCompletionsProvider, InlineValuesProvider, LinkedEditingRangeProvider, LinkProvider, OnTypeFormattingEditProvider, ReferenceProvider, RenameProvider, SelectionRangeProvider, SignatureHelpProvider, TypeDefinitionProvider } from 'vs/editor/common/languages';
import { ILanguageFeaturesService } from 'vs/editor/common/services/languageFeatures';
import { InstantiationType, registerSingleton } from 'vs/platform/instantiation/common/extensions';

export class LanguageFeaturesService implements ILanguageFeaturesService {

	declare _serviceBrand: undefined;

	readonly referenceProvider = new LanguageFeatureRegistry<ReferenceProvider>(this._score.bind(this));
	readonly renameProvider = new LanguageFeatureRegistry<RenameProvider>(this._score.bind(this));
	readonly codeActionProvider = new LanguageFeatureRegistry<CodeActionProvider>(this._score.bind(this));
	readonly definitionProvider = new LanguageFeatureRegistry<DefinitionProvider>(this._score.bind(this));
	readonly typeDefinitionProvider = new LanguageFeatureRegistry<TypeDefinitionProvider>(this._score.bind(this));
	readonly declarationProvider = new LanguageFeatureRegistry<DeclarationProvider>(this._score.bind(this));
	readonly implementationProvider = new LanguageFeatureRegistry<ImplementationProvider>(this._score.bind(this));
	readonly documentSymbolProvider = new LanguageFeatureRegistry<DocumentSymbolProvider>(this._score.bind(this));
	readonly inlayHintsProvider = new LanguageFeatureRegistry<InlayHintsProvider>(this._score.bind(this));
	readonly colorProvider = new LanguageFeatureRegistry<DocumentColorProvider>(this._score.bind(this));
	readonly codeLensProvider = new LanguageFeatureRegistry<CodeLensProvider>(this._score.bind(this));
	readonly documentFormattingEditProvider = new LanguageFeatureRegistry<DocumentFormattingEditProvider>(this._score.bind(this));
	readonly documentRangeFormattingEditProvider = new LanguageFeatureRegistry<DocumentRangeFormattingEditProvider>(this._score.bind(this));
	readonly onTypeFormattingEditProvider = new LanguageFeatureRegistry<OnTypeFormattingEditProvider>(this._score.bind(this));
	readonly signatureHelpProvider = new LanguageFeatureRegistry<SignatureHelpProvider>(this._score.bind(this));
	readonly hoverProvider = new LanguageFeatureRegistry<HoverProvider>(this._score.bind(this));
	readonly documentHighlightProvider = new LanguageFeatureRegistry<DocumentHighlightProvider>(this._score.bind(this));
	readonly selectionRangeProvider = new LanguageFeatureRegistry<SelectionRangeProvider>(this._score.bind(this));
	readonly foldingRangeProvider = new LanguageFeatureRegistry<FoldingRangeProvider>(this._score.bind(this));
	readonly linkProvider = new LanguageFeatureRegistry<LinkProvider>(this._score.bind(this));
	readonly inlineCompletionsProvider = new LanguageFeatureRegistry<InlineCompletionsProvider>(this._score.bind(this));
	readonly completionProvider = new LanguageFeatureRegistry<CompletionItemProvider>(this._score.bind(this));
	readonly linkedEditingRangeProvider = new LanguageFeatureRegistry<LinkedEditingRangeProvider>(this._score.bind(this));
	readonly inlineValuesProvider = new LanguageFeatureRegistry<InlineValuesProvider>(this._score.bind(this));
	readonly evaluatableExpressionProvider = new LanguageFeatureRegistry<EvaluatableExpressionProvider>(this._score.bind(this));
	readonly documentRangeSemanticTokensProvider = new LanguageFeatureRegistry<DocumentRangeSemanticTokensProvider>(this._score.bind(this));
	readonly documentSemanticTokensProvider = new LanguageFeatureRegistry<DocumentSemanticTokensProvider>(this._score.bind(this));
	readonly documentOnDropEditProvider = new LanguageFeatureRegistry<DocumentOnDropEditProvider>(this._score.bind(this));
	readonly documentPasteEditProvider = new LanguageFeatureRegistry<DocumentPasteEditProvider>(this._score.bind(this));

	private _notebookTypeResolver?: NotebookInfoResolver;

	setNotebookTypeResolver(resolver: NotebookInfoResolver | undefined) {
		this._notebookTypeResolver = resolver;
	}

	private _score(uri: URI): NotebookInfo | undefined {
		return this._notebookTypeResolver?.(uri);
	}

}

registerSingleton(ILanguageFeaturesService, LanguageFeaturesService, InstantiationType.Delayed);
