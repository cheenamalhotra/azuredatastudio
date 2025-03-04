/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the Source EULA. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import * as interfaces from './interfaces';
import * as vscode from 'vscode';
import type TelemetryReporter from '@vscode/extension-telemetry';

export class DocumentMergeConflict implements interfaces.IDocumentMergeConflict {

	public range: vscode.Range;
	public current: interfaces.IMergeRegion;
	public incoming: interfaces.IMergeRegion;
	public commonAncestors: interfaces.IMergeRegion[];
	public splitter: vscode.Range;
	private applied = false;

	constructor(descriptor: interfaces.IDocumentMergeConflictDescriptor, private readonly telemetryReporter: TelemetryReporter) {
		this.range = descriptor.range;
		this.current = descriptor.current;
		this.incoming = descriptor.incoming;
		this.commonAncestors = descriptor.commonAncestors;
		this.splitter = descriptor.splitter;
	}

	public commitEdit(type: interfaces.CommitType, editor: vscode.TextEditor, edit?: vscode.TextEditorEdit): Thenable<boolean> {
		function commitTypeToString(type: interfaces.CommitType): string {
			switch (type) {
				case interfaces.CommitType.Current:
					return 'current';
				case interfaces.CommitType.Incoming:
					return 'incoming';
				case interfaces.CommitType.Both:
					return 'both';
			}
		}

		/* __GDPR__
			"mergeMarkers.accept" : {
				"owner": "hediet",
				"comment": "Used to understand how the inline merge editor experience is used.",
				"resolution": { "classification": "SystemMetaData", "purpose": "FeatureInsight", "comment": "Indicates how the merge conflict was resolved by the user" }
			}
		*/
		this.telemetryReporter.sendTelemetryEvent('mergeMarkers.accept', { resolution: commitTypeToString(type) });

		if (edit) {

			this.applyEdit(type, editor.document, edit);
			return Promise.resolve(true);
		}

		return editor.edit((edit) => this.applyEdit(type, editor.document, edit));
	}

	public applyEdit(type: interfaces.CommitType, document: vscode.TextDocument, edit: { replace(range: vscode.Range, newText: string): void }): void {
		if (this.applied) {
			return;
		}
		this.applied = true;

		// Each conflict is a set of ranges as follows, note placements or newlines
		// which may not in spans
		// [ Conflict Range             -- (Entire content below)
		//   [ Current Header ]\n       -- >>>>> Header
		//   [ Current Content ]        -- (content)
		//   [ Splitter ]\n             -- =====
		//   [ Incoming Content ]       -- (content)
		//   [ Incoming Header ]\n      -- <<<<< Incoming
		// ]
		if (type === interfaces.CommitType.Current) {
			// Replace [ Conflict Range ] with [ Current Content ]
			const content = document.getText(this.current.content);
			this.replaceRangeWithContent(content, edit);
		}
		else if (type === interfaces.CommitType.Incoming) {
			const content = document.getText(this.incoming.content);
			this.replaceRangeWithContent(content, edit);
		}
		else if (type === interfaces.CommitType.Both) {
			// Replace [ Conflict Range ] with [ Current Content ] + \n + [ Incoming Content ]

			const currentContent = document.getText(this.current.content);
			const incomingContent = document.getText(this.incoming.content);

			edit.replace(this.range, currentContent.concat(incomingContent));
		}
	}

	private replaceRangeWithContent(content: string, edit: { replace(range: vscode.Range, newText: string): void }) {
		if (this.isNewlineOnly(content)) {
			edit.replace(this.range, '');
			return;
		}

		// Replace [ Conflict Range ] with [ Current Content ]
		edit.replace(this.range, content);
	}

	private isNewlineOnly(text: string) {
		return text === '\n' || text === '\r\n';
	}
}
